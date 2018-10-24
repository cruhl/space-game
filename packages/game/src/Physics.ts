import * as Vector from "./Vector";

export interface Physics {
  position: Vector.Vector;
  velocity: Vector.Vector;
}

export const init = (): Physics => ({
  position: Vector.init(),
  velocity: Vector.init()
});

export const step = (dt: number, { position, velocity }: Physics): Physics => ({
  velocity,
  position: {
    angle: position.angle + velocity.angle,
    x: position.x + velocity.x,
    y: position.y + velocity.y
  }
});
