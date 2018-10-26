import * as Physics from "./Physics";

export interface Particle {
  type: Type;
  lifespanMS: number;
  physics: Physics.Physics;
}

export const enum Type {
  Dummy = "dummy"
}

export const init = (particle: Particle) => {
  const view = document.createElement("div");
  document.body.appendChild(view);

  view.className = `particle ${particle.type}`;
  view.style.left = `${particle.physics.position.value.x}px`;
  view.style.top = `${particle.physics.position.value.y}px`;

  setInterval(() => view.remove(), particle.lifespanMS);
};
