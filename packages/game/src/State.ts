import * as Ship from "./Ship";
import * as Keyboard from "./Keyboard";
import * as Vector from "./Vector";
import * as Projectile from "./Projectile";

export interface State {
  nowMS: number;
  lastBlockUpdateMS: number;

  mouse: Vector.Vector<number, number>;
  keyboard: Keyboard.Keyboard;

  ship: Ship.Ship;
  projectiles: Projectile.Projectile[];
}

export const init = (nowMS: number): State => ({
  nowMS,
  lastBlockUpdateMS: nowMS,

  mouse: Vector.init(),
  keyboard: Keyboard.init(),

  ship: Ship.init(),
  projectiles: [Projectile.init()],
});

export const step = (nowMS: number, state: State) => {
  Ship.step(nowMS - state.nowMS, state, state.ship);
  state.nowMS = nowMS;
};
