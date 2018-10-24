import * as State from "./State";

const gameElement = document.querySelector(".game") as HTMLElement;
const shipElement = document.querySelector(".ship") as HTMLElement;

let state = State.init();

const step = (time: number) => {
  for (const particle of state.particles) {
    const particleElement = document.createElement("div");

    particleElement.style.left = `${particle.physics.position.x}`;
    particleElement.style.top = `${particle.physics.position.y}`;
    particleElement.style.animationDuration = `${particle.lifespanMS}ms`;

    gameElement.appendChild(particleElement);

    window.setTimeout(() => particleElement.remove(), particle.lifespanMS);
  }

  shipElement.style.left = `${state.ship.physics.position.x}px`;
  shipElement.style.top = `${state.ship.physics.position.y}px`;
  shipElement.style.transform = `translate(-50%, -50%) rotate(${
    state.ship.physics.position.angle
  }rad)`;

  state = State.step(time, state);
  window.requestAnimationFrame(step);
};

window.requestAnimationFrame(step);
