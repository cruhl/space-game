import * as Physics from "./Physics";

export interface Material {
  meltingPoint: Physics.DegreesCelsius;
}

export const steel = {
  meltingPoint: 1370
};
