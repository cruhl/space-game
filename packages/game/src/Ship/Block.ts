import * as Vector from "../Vector";
import * as Ship from "./index";

export interface Block {
  type: Type;
  health: number;
  address: Vector.Vector;

  view: HTMLElement;
}

export const enum Type {
  Hull = "hull",
  Shield = "shield"
}

export const init = (ship: Ship.Ship, address: Vector.Vector): Block => {
  const view = document.createElement("div");
  ship.view.appendChild(view);

  view.className = "block";
  view.style.left = `${(100 * address.x) / ship.blocks.dimensions.x}%`;
  view.style.top = `${(100 * address.y) / ship.blocks.dimensions.y}%`;
  view.style.width = `${100 / ship.blocks.dimensions.x}%`;
  view.style.height = `${100 / ship.blocks.dimensions.y}%`;

  return {
    type: Type.Hull,
    health: 1,
    address,

    view
  };
};

export const absolutePosition = (
  ship: Ship.Ship,
  block: Block
): Vector.Vector => {
  const blockOffset = ship.blocks.size / 2;
  const shipWidth = ship.blocks.dimensions.x * ship.blocks.size;
  const shipHeight = ship.blocks.dimensions.y * ship.blocks.size;

  const offsetFromShipOrigin = {
    x: block.address.x * ship.blocks.size - shipWidth / 2 + blockOffset,
    y: block.address.y * ship.blocks.size - shipHeight / 2 + blockOffset
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

export const damage = (amount: number, block: Block) => {
  block.health -= amount;
  block.view.style.opacity = `${block.health}`;
};
