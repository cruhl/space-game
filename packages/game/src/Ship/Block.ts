import * as Material from "../Material";
import * as Percentage from "../Percentage";
import * as Physics from "../Physics";
import * as Vector from "../Vector";
import * as Ship from "./index";

export type BlockIndex = number;
export interface Block {
  type: Type;
  material: Material.Material;
  position: Vector.Vector<number, number>;
  health: Percentage.Percentage;
  temperature: Physics.DegreesCelsius;
  view: HTMLElement;
}

export const enum Type {
  Hull = "hull",
  Shield = "shield"
}

export const init = ({
  position,
  ship
}: {
  position: Vector.Vector<Physics.Meter, Physics.Meter>;
  ship: {
    dimensions: Vector.Vector<BlockIndex, BlockIndex>;
    view: HTMLElement;
  };
}): Block => {
  const view = ship.view.appendChild(document.createElement("div"));
  view.className = "block";
  view.style.left = `${Percentage.toNumber(position.x) / ship.dimensions.x}%`;
  view.style.top = `${Percentage.toNumber(position.y) / ship.dimensions.y}%`;
  view.style.width = `${Percentage.toNumber(1 / ship.dimensions.x)}%`;
  view.style.height = `${Percentage.toNumber(1 / ship.dimensions.y)}%`;

  return {
    type: Type.Hull,
    material: Material.steel,
    position,
    health: Percentage.fromNumber(100),
    temperature: 0 as Physics.DegreesCelsius,
    view
  };
};

export const absolutePosition = (
  ship: Ship.Ship,
  block: Block
): Vector.Vector<Physics.Meter, Physics.Meter> => {
  const blockOffset: Physics.Meter = ship.scale / 2;

  const shipWidth: Physics.Meter = ship.dimensions.x * ship.scale;
  const shipHeight: Physics.Meter = ship.dimensions.y * ship.scale;

  const offsetFromShipOrigin = {
    x: block.position.x * ship.scale - shipWidth / 2 + blockOffset,
    y: block.position.y * ship.scale - shipHeight / 2 + blockOffset
  };

  const angleFromShipOrigin = Math.atan2(
    offsetFromShipOrigin.y,
    offsetFromShipOrigin.x
  );

  const distanceFromShipOrigin = Vector.distance(
    Vector.init(),
    offsetFromShipOrigin
  );

  return {
    x:
      ship.physics.position.value.x +
      distanceFromShipOrigin *
        Math.cos(ship.physics.angle.value + angleFromShipOrigin),
    y:
      ship.physics.position.value.y +
      distanceFromShipOrigin *
        Math.sin(ship.physics.angle.value + angleFromShipOrigin)
  };
};

export const damage = (amount: Percentage.Percentage, block: Block) => {
  block.health -= amount;
  block.view.style.opacity = `${block.health}`;
};

export const heat = (
  temperatureChange: Physics.DegreesCelsius,
  block: Block
) => {
  block.temperature += temperatureChange;
  if (block.temperature <= -273.15) {
    block.temperature = -273.15;
  }

  if (
    ((block.temperature /
      block.material.meltingPoint) as Percentage.Percentage) >=
    Percentage.fromNumber(30)
  ) {
    damage(Percentage.fromNumber(0.2), block);
  }

  const luminosity: Percentage.Percentage =
    Percentage.fromNumber(100) -
    Math.min(
      Percentage.fromNumber(50),
      block.temperature / block.material.meltingPoint
    );

  block.view.style.background = `hsl(0, 100%, ${Percentage.toNumber(
    luminosity
  )}%)`;
};
