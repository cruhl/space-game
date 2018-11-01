import * as Ship from "./Ship";
import * as Keyboard from "./Keyboard";
import * as Vector from "./Vector";

export interface State {
  nowMS: number;
  lastBlockUpdateMS: number;

  mouse: Vector.Vector;
  keyboard: Keyboard.Keyboard;

  ship: Ship.Ship;
}

export const init = (nowMS: number): State => ({
  nowMS,
  lastBlockUpdateMS: nowMS,

  mouse: Vector.init(),
  keyboard: Keyboard.init(),
  ship: Ship.init()
});

export const step = (nowMS: number, state: State) => {
  Ship.step(nowMS - state.nowMS, state, state.ship);
  state.nowMS = nowMS;
};
