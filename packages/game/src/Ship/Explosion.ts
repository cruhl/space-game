import * as Ship from "./index";
import * as Physics from "../Physics";
import * as Vector from "../Vector";
import * as Percentage from "../Percentage";
import * as Block from "./Block";
import * as Particle from "../Particle";
import * as Time from "../Time";

export const explosion = (
  energy: Physics.TonsTNT,
  position: Vector.Vector<Physics.Meter, Physics.Meter>,
  ship: Ship.Ship
) => {
  const radius: Physics.Meter =
    (300 as Physics.Meter) * ((energy / 11) as Percentage.Percentage);

  const maxTemperature: Physics.DegreesCelsius = energy * 1000;

  for (const [, block] of ship.blocks) {
    const blockPosition = Block.absolutePosition(ship, block);
    const distance: Physics.Meter = Vector.distance(position, blockPosition);

    if (distance > radius) continue;

    const percentageOfRadius = (radius - distance) / radius;

    Block.heat(maxTemperature * Math.pow(percentageOfRadius * 1.2, 3), block);
    Block.damage(2 * energy * Math.pow(percentageOfRadius, 6), block);
  }

  // Particle effects
  true && smoke(position, energy);
  true && debris(position, energy);
  true && gases(position, energy);
  true && flash(position, energy);
};

const smoke = (
  position: Vector.Vector<Physics.Meter, Physics.Meter>,
  energy: Physics.TonsTNT
) =>
  Particle.explosion({
    position,
    count: Math.max(1, energy / 3),
    minDuration: 10 * Time.second,
    maxDuration: 20 * Time.second,
    minRadius: 0,
    maxRadius: energy * 20,
    minParticleRadius: energy * 50,
    maxParticleRadius: energy * 125,
    colorStops: [
      `hsla(0, 0%, 25%, 0.9) 0%`,
      `hsla(0, 0%, 20%, 0.9) 25%`,
      `hsla(0, 0%, 15%, 0.7) 55%`,
      `hsla(0, 0%, 0%, 0) 100%`,
    ],
  });

const debris = (
  position: Vector.Vector<Physics.Meter, Physics.Meter>,
  energy: Physics.TonsTNT
) =>
  Particle.explosion({
    position,
    count: Math.max(3, Math.min(energy * 2, 10)),
    minDuration: 1 * Time.second,
    maxDuration: 5 * Time.second,
    minRadius: Math.max(100, energy * 25),
    maxRadius: Math.max(250, energy * 75),
    minParticleRadius: Math.max(25, energy * 25),
    maxParticleRadius: Math.max(100, energy * 25),
    colorStops: [
      `hsla(50, 100%, 100%, 1) 0%`,
      `hsla(40, 100%, 50%, 1) 10%`,
      `hsla(20, 100%, 50%, 0.5) 15%`,
      `hsla(0, 100%, 50%, 0.2) 50%`,
      `hsla(0, 0%, 0%, 0) 100%`,
    ],
  });

const gases = (
  position: Vector.Vector<Physics.Meter, Physics.Meter>,
  energy: Physics.TonsTNT
) =>
  Particle.explosion({
    position,
    count: energy / 3,
    minDuration: 4 * Time.second,
    maxDuration: 8 * Time.second,
    minRadius: energy * 5,
    maxRadius: energy * 10,
    minParticleRadius: energy * 60,
    maxParticleRadius: energy * 90,
    colorStops: [
      `hsla(35, 100%, 65%, 1) 0%`,
      `hsla(20, 100%, 50%, 0.9) 35%`,
      `hsla(10, 100%, 50%, 0.4) 55%`,
      `hsla(0, 100%, 50%, 0.2) 75%`,
      `hsla(0, 0%, 0%, 0) 100%`,
    ],
  });

const flash = (
  position: Vector.Vector<Physics.Meter, Physics.Meter>,
  energy: Physics.TonsTNT
) =>
  Particle.light(
    (energy * 85) as Physics.Meter,
    {
      type: Particle.Type.Light,
      duration: 400 * Time.millisecond,
      physics: Physics.init({
        position: {
          value: position,
        },
      }),
    },
    [
      `hsla(50, 100%, 100%, 1) 0%`,
      `hsla(45, 100%, 75%, 1) 40%`,
      `hsla(35, 100%, 50%, 0.9) 65%`,
      `hsla(0, 100%, 50%, 0.3) 90%`,
      `hsla(0, 0%, 0%, 0) 100%`,
    ]
  );
