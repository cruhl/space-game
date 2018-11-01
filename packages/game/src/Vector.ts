import * as Angle from "./Angle";

export interface Vector<X, Y> {
  x: X;
  y: Y;
}

export const init = () => ({
  x: 0,
  y: 0
});

export const fromPolar = (
  angle: Angle.Radians,
  magnitude: number
): Vector<number, number> => ({
  x: magnitude * Math.cos(angle),
  y: magnitude * Math.sin(angle)
});

export const distance = (
  a: Vector<number, number>,
  b: Vector<number, number>
): number => Math.sqrt(distanceSquared(a, b));

export const distanceSquared = (
  a: Vector<number, number>,
  b: Vector<number, number>
): number => {
  const DX = a.x - b.x;
  const DY = a.y - b.y;
  return DX * DX + DY * DY;
};

export const toString = ({ x, y }: Vector<number, number>): string =>
  `${x},${y}`;
