import * as Angle from "./Angle";

export interface Vector {
  x: number;
  y: number;
}

export const init = () => ({
  x: 0,
  y: 0
});

export const fromPolar = (angle: Angle.Angle, magnitude: number): Vector => ({
  x: magnitude * Math.cos(angle),
  y: magnitude * Math.sin(angle)
});

export const distance = (a: Vector, b: Vector): number =>
  Math.sqrt(distanceSquared(a, b));

export const distanceSquared = (a: Vector, b: Vector): number => {
  const DX = a.x - b.x;
  const DY = a.y - b.y;
  return DX * DX + DY * DY;
};
