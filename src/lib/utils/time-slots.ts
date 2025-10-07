import { TIME_SLOTS } from '../constants';

/**
 * Generate realistic festival time slots based on artist position
 * @param stageIndex - Index of the stage (0 = Main, 1 = Second, 2 = Third)
 * @param artistIndex - Position of artist in lineup
 * @param isHeadliner - Whether this artist is the headliner
 * @returns Formatted time string (e.g., "2:00 PM")
 */
export function generateTimeSlot(
  stageIndex: number,
  artistIndex: number,
  isHeadliner: boolean
): string {
  if (isHeadliner) {
    return TIME_SLOTS.HEADLINER_TIME;
  }

  // Different stages have different start times
  const startTime = TIME_SLOTS.STAGE_START_TIMES[stageIndex] || TIME_SLOTS.STAGE_START_TIMES[0];
  const slotDuration = TIME_SLOTS.SLOT_DURATION_MINUTES;

  const totalMinutes = startTime.hour * 60 + startTime.minute + artistIndex * slotDuration;
  const hour = Math.floor(totalMinutes / 60) % 24;
  const minute = totalMinutes % 60;

  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayMinute = minute.toString().padStart(2, '0');

  return `${displayHour}:${displayMinute} ${period}`;
}
