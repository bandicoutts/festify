import { generateCodeVerifier, generateCodeChallenge, generateRandomState } from './pkce';

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI!;

const SCOPES = [
  'user-top-read',
  'user-read-recently-played',
].join(' ');

/**
 * Initiates the Spotify OAuth flow with PKCE
 * Redirects user to Spotify authorization page
 */
export async function initiateSpotifyLogin(): Promise<void> {
  if (!SPOTIFY_CLIENT_ID) {
    throw new Error('Spotify Client ID is not configured');
  }

  // Generate PKCE parameters
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateRandomState();

  // Store verifier and state for callback validation
  sessionStorage.setItem('spotify_code_verifier', codeVerifier);
  sessionStorage.setItem('spotify_auth_state', state);

  // Build authorization URL
  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    state: state,
  });

  // Redirect to Spotify
  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  window.location.href = authUrl;
}

/**
 * Handles the OAuth callback
 * Exchanges authorization code for access token
 */
export async function handleSpotifyCallback(code: string, state: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  // Validate state to prevent CSRF attacks
  const storedState = sessionStorage.getItem('spotify_auth_state');
  if (state !== storedState) {
    throw new Error('State mismatch - possible CSRF attack');
  }

  // Retrieve code verifier
  const codeVerifier = sessionStorage.getItem('spotify_code_verifier');
  if (!codeVerifier) {
    throw new Error('Code verifier not found');
  }

  // Exchange code for token via our API route
  const response = await fetch('/api/spotify/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      codeVerifier,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to exchange token');
  }

  const tokens = await response.json();

  // Store tokens in session storage
  sessionStorage.setItem('spotify_access_token', tokens.access_token);
  sessionStorage.setItem('spotify_refresh_token', tokens.refresh_token);
  sessionStorage.setItem('spotify_token_expires_at', 
    (Date.now() + tokens.expires_in * 1000).toString()
  );

  // Clean up temporary storage
  sessionStorage.removeItem('spotify_code_verifier');
  sessionStorage.removeItem('spotify_auth_state');

  return tokens;
}

/**
 * Gets the current access token
 * Returns null if not authenticated
 */
export function getAccessToken(): string | null {
  return sessionStorage.getItem('spotify_access_token');
}

/**
 * Checks if the user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = getAccessToken();
  const expiresAt = sessionStorage.getItem('spotify_token_expires_at');
  
  if (!token || !expiresAt) {
    return false;
  }

  // Check if token is expired
  return Date.now() < parseInt(expiresAt);
}

/**
 * Logs out the user by clearing all stored tokens
 */
export function logout(): void {
  sessionStorage.removeItem('spotify_access_token');
  sessionStorage.removeItem('spotify_refresh_token');
  sessionStorage.removeItem('spotify_token_expires_at');
  sessionStorage.removeItem('spotify_code_verifier');
  sessionStorage.removeItem('spotify_auth_state');
}