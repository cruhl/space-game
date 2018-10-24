import * as Physics from "./Physics";

export interface Ship {
  physics: Physics.Physics;
}

export const init = () => ({
  physics: {
    position: {
      angle: (2 * Math.PI) / 8,
      x: 200,
      y: 200
    },
    velocity: {
      angle: 0.001,
      x: 1,
      y: 1
    }
  }
});

export const step = (dt: number, ship: Ship): Ship => ({
  ...ship,
  physics: Physics.step(dt, ship.physics)
});
