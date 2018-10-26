import * as Vector from "./Vector";
import * as Angle from "./Angle";

export interface Physics {
  angle: {
    value: Angle.Angle;
    velocity: Angle.Angle;
    acceleration: Angle.Angle;
  };
  position: {
    value: Vector.Vector;
    velocity: Vector.Vector;
    acceleration: Vector.Vector;
  };
}

export const init = (): Physics => ({
  angle: {
    value: Angle.init(),
    velocity: Angle.init(),
    acceleration: Angle.init()
  },
  position: {
    value: Vector.init(),
    velocity: Vector.init(),
    acceleration: Vector.init()
  }
});

export const step = (dt: number, { angle, position }: Physics) => {
  angle.velocity = angle.velocity + angle.acceleration;
  angle.value = angle.value + angle.velocity;

  position.velocity.x = position.velocity.x + position.acceleration.x;
  position.velocity.y = position.velocity.y + position.acceleration.y;

  position.value.x = position.value.x + position.velocity.x;
  position.value.y = position.value.y + position.velocity.y;
};
