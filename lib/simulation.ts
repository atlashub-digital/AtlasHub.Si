export type Assumptions = {
  volume: number;
  minutes: number;
  coverage: number;
  exceptions: number;
  reviewMinutes: number;
};
export function simulateCapacity(a: Assumptions) {
  const bounds: Record<keyof Assumptions, [number, number]> = {
    volume: [0, 100000],
    minutes: [0, 240],
    coverage: [0, 100],
    exceptions: [0, 100],
    reviewMinutes: [0, 240],
  };
  for (const key of Object.keys(bounds) as (keyof Assumptions)[]) {
    if (
      !Number.isFinite(a[key]) ||
      a[key] < bounds[key][0] ||
      a[key] > bounds[key][1]
    )
      throw Error("Invalid assumption: " + key);
  }
  const eligible = (a.volume * a.coverage) / 100;
  const exceptions = (eligible * a.exceptions) / 100;
  const baselineHours = (a.volume * a.minutes) / 60;
  const futureHours =
    ((a.volume - eligible + exceptions) * a.minutes +
      (eligible - exceptions) * a.reviewMinutes) /
    60;
  const savedHours = baselineHours - futureHours;
  return {
    baselineHours,
    futureHours,
    savedHours,
    eligible,
    exceptions,
    rate: baselineHours ? (100 * savedHours) / baselineHours : 0,
  };
}
