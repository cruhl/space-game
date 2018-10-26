import * as Particle from "../Particle";
import * as Physics from "../Physics";
import * as State from "../State";
import * as Vector from "../Vector";
import * as Template from "./Template";
import * as Block from "./Block";
import * as Angle from "../Angle";

export const BLOCK_SIZE = 15;

export interface Ship {
  physics: Physics.Physics;
  blocks: {
    value: Block.Block[];
    dimensions: Vector.Vector;
    size: number;
  };

  view: HTMLElement;
}

export const init = (): Ship => {
  const physics = Physics.init();

  physics.angle.value = Angle.fromDegrees(10);
  physics.position = {
    value: { x: 200, y: 200 },
    velocity: Vector.init(),
    acceleration: Vector.init()
  };

  const template = Template.medium || [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  const size = template;

  const view = document.createElement("div");
  document.body.appendChild(view);

  view.className = "ship";
  view.style.width = `${BLOCK_SIZE * template[0].length}px`;
  view.style.height = `${BLOCK_SIZE * template.length}px`;

  const ship = {
    physics,
    blocks: {
      value: [],
      size: BLOCK_SIZE,
      dimensions: {
        x: template[0].length,
        y: template.length
      }
    },

    view
  };

  template.forEach((row, rowIndex, rows) => {
    row.forEach((column, columnIndex, columns) => {
      if (column == 0) return;
      ship.blocks.value.push(Block.init(ship, { x: columnIndex, y: rowIndex }));
    });
  });

  return ship;
};

export const step = (dt: number, state: State.State, ship: Ship) => {
  Physics.step(dt, ship.physics);

  ship.view.style.left = `${state.ship.physics.position.value.x}px`;
  ship.view.style.top = `${state.ship.physics.position.value.y}px`;
  ship.view.style.transform = `translate(-50%, -50%) rotate(${
    state.ship.physics.angle.value
  }rad)`;
};

export const explosion = (
  position: Vector.Vector,
  damage: number,
  radius: number,
  ship: Ship
) => {
  ship.blocks.value.forEach(block => {
    const blockPosition = Block.absolutePosition(ship, block);

    const distance = Vector.distance(position, blockPosition);

    if (distance > radius) return;
    Block.damage(damage * ((radius - distance) / radius), block);
    Particle.init({
      type: Particle.Type.Dummy,
      lifespanMS: 1000,
      physics: {
        ...Physics.init(),
        position: {
          value: blockPosition,
          velocity: Vector.init(),
          acceleration: Vector.init()
        }
      }
    });
  });
};
