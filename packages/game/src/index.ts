import * as State from "./State";
import * as Keyboard from "./Keyboard";
import * as Ship from "./Ship";

let state = State.init(new Date().getTime());

const step = (nowMS: number) => {
  State.step(nowMS, state);
  window.requestAnimationFrame(step);
};

window.requestAnimationFrame(step);

setInterval(() => {
  Ship.stepBlocks(state.nowMS - state.lastBlockUpdateMS, state.ship);
  state.lastBlockUpdateMS = state.nowMS;
}, 300);

document.addEventListener("keydown", event => {
  Keyboard.down(event.keyCode, state.keyboard);
});

document.addEventListener("keyup", event => {
  Keyboard.up(event.keyCode, state.keyboard);
});

document.addEventListener("mousemove", event => {
  state.mouse.x = event.clientX;
  state.mouse.y = event.clientY;
});

document.addEventListener("mousedown", event => {
  state.mouse.x = event.clientX;
  state.mouse.y = event.clientY;

  Ship.explosion({
    energy: 11,
    position: state.mouse,
    ship: state.ship
  });
});
