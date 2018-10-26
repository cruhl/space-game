export interface Keyboard {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;

  up: boolean;
  left: boolean;
  right: boolean;
  down: boolean;
}

export const init = (): Keyboard => ({
  w: false,
  a: false,
  s: false,
  d: false,

  up: false,
  left: false,
  right: false,
  down: false
});

export const down = (keyCode: number, keyboard: Keyboard) =>
  toggleKey(true, keyCode, keyboard);

export const up = (keyCode: number, keyboard: Keyboard) =>
  toggleKey(false, keyCode, keyboard);

const toggleKey = (isPressed: boolean, keyCode: number, keyboard: Keyboard) => {
  if (keyCode == 87) keyboard.w = isPressed;
  if (keyCode == 83) keyboard.a = isPressed;
  if (keyCode == 65) keyboard.s = isPressed;
  if (keyCode == 68) keyboard.d = isPressed;

  if (keyCode == 38) keyboard.up = isPressed;
  if (keyCode == 40) keyboard.left = isPressed;
  if (keyCode == 37) keyboard.right = isPressed;
  if (keyCode == 39) keyboard.down = isPressed;
};
