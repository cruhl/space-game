import * as Physics from "../Physics";
import * as State from "../State";
import * as Vector from "../Vector";
import * as Block from "./Block";
import * as Template from "./Template";

export * from "./Explosion";

export interface Ship {
  scale: MetersPerBlock;
  blocks: Map<string, Block.Block>;
  dimensions: Vector.Vector<Block.BlockIndex, Block.BlockIndex>;

  physics: Physics.Physics;
  view: HTMLElement;
}

type MetersPerBlock = number;

export const init = (): Ship => {
  const scale = 15;
  const template = Template.large;
  const rows = template.split("\n").filter((row) => row !== "");

  const dimensions = {
    x: Math.max(...rows.map((row) => row.length)),
    y: rows.length,
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
  physics.position.value = { x: 600, y: 200 };

  return {
    scale,
    blocks,
    dimensions,
    physics,
    view,
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
      { x: block.position.x + 1, y: block.position.y + 1 },
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
  ship.view.style.transform = `translate(-50%, -50%) rotate(${state.ship.physics.angle.value}rad)`;
};
