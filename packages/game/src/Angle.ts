export type Angle = number;

export const init = (): Angle => 0;

export const fromDegrees = (degrees: number): Angle =>
  (degrees * Math.PI) / 180;

export const toDegrees = (angle: Angle): number => (angle * 180) / Math.PI;
