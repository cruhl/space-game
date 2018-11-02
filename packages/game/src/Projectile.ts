import * as Physics from "./Physics";

export interface Projectile {
  physics: Physics.Physics;
}

export const init = (config: { physics: Physics.Physics }) => ({
  physics: config.physics || Physics.init()
});
