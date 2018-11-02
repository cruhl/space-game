import * as Particle from "../Particle";
import * as Percentage from "../Percentage";
import * as Physics from "../Physics";
import * as State from "../State";
import * as Time from "../Time";
import * as Vector from "../Vector";
import * as Block from "./Block";
import * as Template from "./Template";

export interface Ship {
  scale: MetersPerBlock;
  blocks: Map<string, Block.Block>;
  dimensions: Vector.Vector<Block.BlockIndex, Block.BlockIndex>;

  physics: Physics.Physics;
  view: HTMLElement;
}

type MetersPerBlock = number;

export const init = (): Ship => {
  const scale = 10;
  const template = Template.large;
  const rows = template.split("\n").filter(row => row !== "");

  const dimensions = {
    x: Math.max(...rows.map(row => row.length)),
    y: rows.length
  };

  const view = document.body.appendChild(document.createElement("div"));
  view.className = "ship";
  view.style.width = `${scale * dimensions.x}px`;
  view.style.height = `${scale * dimensions.y}px`;

  const blocks = new Map();
  for (const [rowIndex, row] of rows.entries())
    for (const [columnIndex, column] of row.split("").entries()) {
      if (column === " ") continue;

      const position = { x: columnIndex, y: rowIndex };
      blocks.set(
        Vector.toString(position),
        Block.init({ position, ship: { dimensions, view } })
      );
    }

  const physics = Physics.init();
  physics.angle.acceleration = 0.000001;
  physics.position.value = { x: 600, y: 200 };
  physics.position.acceleration = { x: 0.0001, y: 0.0001 };

  return {
    scale,
    blocks,
    dimensions,
    physics,
    view
  };
};

export const stepBlocks = (_dt: number, ship: Ship) => {
  for (const [, block] of ship.blocks) {
    if (block.temperature < 0.01) {
      block.temperature = 0;
      continue;
    }

    const maxTemperatureTransfer = 0.2 * (block.temperature / 8);
    for (const neighborPosition of [
      // top row
      { x: block.position.x - 1, y: block.position.y - 1 },
      { x: block.position.x, y: block.position.y - 1 },
      { x: block.position.x + 1, y: block.position.y - 1 },

      // middle row
      { x: block.position.x - 1, y: block.position.y },
      { x: block.position.x + 1, y: block.position.y },

      // bottom row
      { x: block.position.x - 1, y: block.position.y + 1 },
      { x: block.position.x, y: block.position.y + 1 },
      { x: block.position.x + 1, y: block.position.y + 1 }
    ]) {
      const neighbor = ship.blocks.get(Vector.toString(neighborPosition));
      if (!neighbor) {
        Block.heat(-5 as Physics.DegreesCelsius, block);
        continue;
      }

      Block.heat(-maxTemperatureTransfer, block);
      Block.heat(maxTemperatureTransfer, neighbor);
    }
  }
};

export const step = (dt: number, state: State.State, ship: Ship) => {
  Physics.step(dt, ship.physics);

  ship.view.style.left = `${state.ship.physics.position.value.x}px`;
  ship.view.style.top = `${state.ship.physics.position.value.y}px`;
  ship.view.style.transform = `translate(-50%, -50%) rotate(${
    state.ship.physics.angle.value
  }rad)`;
};

/*
  Explosion values are based on the MOAB
  https://en.wikipedia.org/wiki/GBU-43/B_MOAB
*/
export const explosion = (
  energy: Physics.TonsTnt,
  position: Vector.Vector<Physics.Meter, Physics.Meter>,
  ship: Ship
) => {
  //
  const radius: Physics.Meter =
    (300 as Physics.Meter) * ((energy / 11) as Percentage.Percentage);

  const maxTemperature: Physics.DegreesCelsius = energy * 1000;

  for (const [, block] of ship.blocks) {
    const blockPosition = Block.absolutePosition(ship, block);
    const distance: Physics.Meter = Vector.distance(position, blockPosition);

    if (distance > radius) continue;

    const percentageOfRadius = (radius - distance) / radius;

    Block.heat(maxTemperature * Math.pow(percentageOfRadius, 3), block);
    Block.damage(0.5 * energy * Math.pow(percentageOfRadius, 3), block);
  }

  Particle.explosion({
    position,
    count: Math.max(1, energy / 3),
    minDuration: 10 * Time.second,
    maxDuration: 20 * Time.second,
    minRadius: 0,
    maxRadius: energy * 50,
    minParticleRadius: energy * 50,
    maxParticleRadius: energy * 100,
    colorStops: [
      `hsla(0, 0%, 25%, 1) 0%`,
      `hsla(0, 0%, 25%, 0.6) 55%`,
      `hsla(0, 0%, 0%, 0) 100%`
    ]
  });

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
      `hsla(0, 0%, 0%, 0) 100%`
    ]
  });

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
      `hsla(45, 100%, 75%, 1) 0%`,
      `hsla(35, 100%, 50%, 0.9) 20%`,
      `hsla(15, 100%, 50%, 0.4) 55%`,
      `hsla(0, 100%, 50%, 0.1) 85%`,
      `hsla(0, 0%, 0%, 0) 100%`
    ]
  });

  Particle.light(
    (energy * 85) as Physics.Meter,
    {
      type: Particle.Type.Light,
      duration: 400 * Time.millisecond,
      physics: Physics.init({
        position: {
          value: position
        }
      })
    },
    [
      `hsla(50, 100%, 100%, 1) 0%`,
      `hsla(45, 100%, 75%, 1) 40%`,
      `hsla(35, 100%, 50%, 0.9) 65%`,
      `hsla(0, 100%, 50%, 0.3) 90%`,
      `hsla(0, 0%, 0%, 0) 100%`
    ]
  );
};
