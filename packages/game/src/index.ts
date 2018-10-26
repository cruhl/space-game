import * as State from "./State";
import * as Keyboard from "./Keyboard";
import * as Ship from "./Ship";

let state = State.init();

const step = (time: number) => {
  State.step(time, state);
  window.requestAnimationFrame(step);
};

window.requestAnimationFrame(step);

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

  Ship.explosion(state.mouse, 0.2, 50, state.ship);
});
