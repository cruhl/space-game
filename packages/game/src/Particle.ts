import * as Physics from "./Physics";

export interface Particle {
  lifespanMS: number;
  physics: Physics.Physics;
}
