const DECIMAL_PLACES = 2;
const FACTOR = 10 ** DECIMAL_PLACES;

/**
 * Làm tròn số đến 2 chữ số thập phân.
 * null/undefined trả về 0.
 */
export function roundToTwo(value: number | null | undefined): number {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }
  return Math.round(value * FACTOR) / FACTOR;
}
