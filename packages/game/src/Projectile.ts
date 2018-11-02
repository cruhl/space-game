import * as Physics from "./Physics";

export interface Projectile {
  physics: Physics.Physics;
}

export const init = () => ({
  physics: Physics.init()
});
