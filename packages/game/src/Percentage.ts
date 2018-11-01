export type Percentage = number;

export const fromNumber = (number: number): Percentage =>
  number > 100 ? 1 : number < 0 ? 0 : number / 100;

export const toNumber = (percentage: Percentage): number => percentage * 100;
