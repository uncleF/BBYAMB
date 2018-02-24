import scene from 'scene/scene';

import state from 'state';

import keyboard from 'input/keyboard';
import mouse from 'input/mouse';
import touch from 'input/touch';
import buttons from 'input/buttons';
import bike from 'input/bike';

function input(container) {
  keyboard(container);
  mouse(container);
  touch(container);
  buttons(container);
  bike(container);
}

export default function init() {
  const container = document.querySelector('#app');
  state(container);
  input(container);
  scene(container);
}
