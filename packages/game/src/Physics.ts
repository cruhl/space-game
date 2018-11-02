import * as Angle from "./Angle";
import * as Vector from "./Vector";

export type Meter = number;
export type TonsTnt = number;
export type DegreesCelsius = number;

export interface Physics {
  angle: AngleMechanics;
  position: PositionMechanics;
}

export type AngleMechanics = Mechanics<Angle.Radians>;
export type PositionMechanics = Mechanics<Vector.Vector<Meter, Meter>>;

interface Mechanics<Unit> {
  value: Unit;
  velocity: Unit;
  acceleration: Unit;
}

export const init = (config?: {
  angle?: Partial<AngleMechanics>;
  position?: Partial<PositionMechanics>;
}): Physics => {
  const defaults = {
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
  };

  if (!config) return defaults;

  return {
    position: !config.position
      ? defaults.position
      : {
          value: config.position.value || defaults.position.value,
          velocity: config.position.velocity || defaults.position.velocity,
          acceleration:
            config.position.acceleration || defaults.position.acceleration
        },

    angle: !config.angle
      ? defaults.angle
      : {
          value: config.angle.value || defaults.angle.value,
          velocity: config.angle.velocity || defaults.angle.velocity,
          acceleration: config.angle.acceleration || defaults.angle.acceleration
        }
  };
};

export const step = (dt: number, { angle, position }: Physics) => {
  if (angle.acceleration !== 0)
    angle.velocity = angle.velocity + angle.acceleration;

  if (angle.velocity !== 0) angle.value = angle.value + angle.velocity;

  if (position.acceleration.x !== 0)
    position.velocity.x = position.velocity.x + position.acceleration.x;

  if (position.acceleration.y !== 0)
    position.velocity.y = position.velocity.y + position.acceleration.y;

  if (position.velocity.x !== 0)
    position.value.x = position.value.x + position.velocity.x;

  if (position.velocity.y !== 0)
    position.value.y = position.value.y + position.velocity.y;
};
