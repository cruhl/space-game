import * as Vector from "./Vector";
import * as Angle from "./Angle";

export type Meter = number;
export type TonsTnt = number;
export type DegreesCelsius = number;

export interface Physics {
  angle: {
    value: Angle.Radians;
    velocity: Angle.Radians;
    acceleration: Angle.Radians;
  };
  position: {
    value: Vector.Vector<Meter, Meter>;
    velocity: Vector.Vector<Meter, Meter>;
    acceleration: Vector.Vector<Meter, Meter>;
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
