export type Radians = number;
export type Degrees = number;

export const init = (): Radians => 0;

export const fromDegrees = (angle: Degrees): Radians => (angle * Math.PI) / 180;
export const toDegrees = (angle: Radians): Degrees => (angle * 180) / Math.PI;
