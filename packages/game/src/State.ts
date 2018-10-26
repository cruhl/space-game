import * as Ship from "./Ship";
import * as Particle from "./Particle";
import * as Keyboard from "./Keyboard";
import * as Vector from "./Vector";

export interface State {
  now: number;
  mouse: Vector.Vector;
  keyboard: Keyboard.Keyboard;
  ship: Ship.Ship;
}

export const init = (): State => ({
  now: 0,
  mouse: Vector.init(),
  keyboard: Keyboard.init(),
  ship: Ship.init()
});

export const step = (now: number, state: State) => {
  const dt = now - state.now;
  state.now = now;
  Ship.step(dt, state, state.ship);
};
