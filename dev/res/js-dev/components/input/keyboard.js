/* eslint no-multi-spaces: 'off' */

import { names, trigger } from 'signal';

const KEY_CODES = {
  37: names.shiftleft,  // Left
  39: names.shiftright, // Right
  38: names.shiftup,    // Up
  40: names.shiftdown,  // Down
  33: names.shiftup,    // PageUp
  34: names.shiftdown,  // PageDown
  65: names.shiftleft,  // A
  68: names.shiftright, // D
  87: names.shiftup,    // W
  83: names.shiftdown,  // S
  32: names.switch,     // Space
  49: names.detail,     // 1
  50: names.detail,     // 2
  51: names.detail,     // 3
  52: names.detail,     // 4
  97: names.detail,     // Num 1
  98: names.detail,     // Num 2
  99: names.detail,     // Num 3
  100: names.detail,    // Num 4
};

const DETAILS = {
  49: 1,
  50: 2,
  51: 3,
  52: 4,
  97: 1,
  98: 2,
  99: 3,
  100: 4,
};

let catcher;

function hasKey(code) {
  return {}.hasOwnProperty.call(KEY_CODES, code);
}

function hasDetail(mode) {
  return {}.hasOwnProperty.call(DETAILS, mode);
}

function generateEventData(keyCode, shiftKey, ctrlKey) {
  const data = {};
  if (hasDetail(keyCode)) {
    data.detail = DETAILS[keyCode];
  } else {
    data.rotation = shiftKey;
    data.scale = ctrlKey;
  }
  return data;
}

function triggerEvent(event) {
  const { keyCode, shiftKey, ctrlKey } = event;
  const data = generateEventData(keyCode, shiftKey, ctrlKey);
  const name = KEY_CODES[keyCode];
  trigger(catcher, name, false, 'UIEvent', data);
}

function onKeyDown(event) {
  event.preventDefault();
  if (hasKey(event.keyCode)) triggerEvent(event);
}

function subscribe() {
  document.addEventListener('keydown', onKeyDown);
}

export default function init(node) {
  catcher = node;
  subscribe();
}
