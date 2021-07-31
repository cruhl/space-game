import * as Angle from "./Angle";
import * as Physics from "./Physics";
import * as Time from "./Time";
import * as Vector from "./Vector";

export interface Particle {
  type: Type;
  duration: Time.Time;
  physics: Physics.Physics;
}

export const enum Type {
  Light = "light",
  Dummy = "dummy",
}

export const explosion = (config: {
  count: number;
  minDuration: Time.Time;
  maxDuration: Time.Time;
  minRadius: Physics.Meter;
  maxRadius: Physics.Meter;
  minParticleRadius: Physics.Meter;
  maxParticleRadius: Physics.Meter;
  colorStops: string[];
  position: Vector.Vector<Physics.Meter, Physics.Meter>;
}) => {
  for (let i = 0; i < Math.max(1, config.count); i++)
    light(
      randomBetween(
        config.minParticleRadius,
        config.maxParticleRadius
      ) as Physics.Meter,
      {
        type: Type.Dummy,
        duration: randomBetween(config.minDuration, config.maxDuration),
        physics: {
          ...Physics.init(),
          position: {
            value: config.position,
            velocity: Vector.fromPolar(
              Angle.fromDegrees(360 * Math.random()),
              randomBetween(config.minRadius, config.maxRadius)
            ),
            acceleration: Vector.init(),
          },
        },
      },
      config.colorStops
    );
};

export const light = (
  radius: Physics.Meter,
  particle: Particle,
  colorStops: string[]
) => {
  const view = init({ ...particle, type: Type.Light });
  view.style.width = view.style.height = `${radius / 2}px`;
  view.style.background = `radial-gradient(closest-side, ${colorStops.join(
    ", "
  )})`;
};

export const init = (particle: Particle): HTMLElement => {
  const view = document.createElement("div");
  document.body.appendChild(view);

  view.className = `particle ${particle.type}`;
  view.style.left = `${particle.physics.position.value.x}px`;
  view.style.top = `${particle.physics.position.value.y}px`;

  const shiftCenter = "translate(-50%, -50%)";

  const diff = 50;
  const rotation1 = randomBetween(0, 360) as Angle.Degrees;
  const rotation2 = (rotation1 + randomBetween(-diff, diff)) as Angle.Degrees;
  const rotation3 = (rotation2 + randomBetween(-diff, diff)) as Angle.Degrees;

  // `any` or it complains we don't include *all possible* CSS properties
  const keyframes: any = [
    {
      offset: 0,
      opacity: 1,
      transform: `${shiftCenter} rotate(${rotation1}deg) scale(0, 0)`,
    },

    {
      offset: 0.05,
      opacity: 1,
      transform: `${shiftCenter} rotate(${rotation2}deg) scale(1, 1.1)`,
    },

    { offset: 0.15, opacity: 0.8 },
    { offset: 0.21, opacity: 0.9 },
    { offset: 0.38, opacity: 0.6 },
    { offset: 0.42, opacity: 0.7 },
    { offset: 0.52, opacity: 0.5 },
    { offset: 0.68, opacity: 0.7 },
    { offset: 0.75, opacity: 0.3 },
    { offset: 0.89, opacity: 0.2 },
    { offset: 0.91, opacity: 0.1 },

    {
      offset: 1,
      opacity: 0,
      transform: `
        ${shiftCenter}
        rotate(${rotation3}deg)

        translate(
          ${particle.physics.position.velocity.x}px,
          ${particle.physics.position.velocity.y}px
        )

        scale(0.5, 0.4)`,
    },
  ];

  view.animate(keyframes, {
    duration: particle.duration,
    fill: "forwards",
  });

  setInterval(() => view.remove(), particle.duration);
  return view;
};

const randomBetween = (min: number, max: number): number =>
  min + (max - min) * Math.random();
