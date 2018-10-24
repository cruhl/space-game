import * as Ship from "./Ship";
import * as Particle from "./Particle";

export interface State {
  now: number;
  ship: Ship.Ship;
  particles: Particle.Particle[];
}

export const init = (): State => ({
  now: 0,
  ship: Ship.init(),
  particles: []
});

export const step = (now: number, state: State) => {
  const dt = now - state.now;

  return {
    now,
    ship: Ship.step(dt, state.ship),
    particles: []
  };
};
