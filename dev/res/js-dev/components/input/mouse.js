/* eslint no-use-before-define: 'off' */

import { names, trigger } from 'signal';

let catcher;

let movePrevious;
let moveCurrent;

function savePosition() {
  movePrevious = moveCurrent;
}

function updatePosition(event) {
  moveCurrent = {
    x: event.clientX,
    y: event.clientY,
  };
}

function calculateDistance() {
  return {
    x: moveCurrent.x - movePrevious.x,
    y: moveCurrent.y - movePrevious.y,
  };
}

function generateMoveEventData() {
  return {
    distance: calculateDistance(),
  };
}

function generateHorizontalWheelEvent(delta) {
  return delta > 0 ? names.shiftleft : names.shiftright;
}

function generateVerticalWheelEvent(delta) {
  return delta > 0 ? names.shiftup : names.shiftdown;
}

function generateWheelEvent(event) {
  const { wheelDeltaX, wheelDeltaY, wheelDelta, shiftKey } = event;
  const isHorizontal = shiftKey || Math.abs(wheelDeltaX) > Math.abs(wheelDeltaY);
  return isHorizontal ? generateHorizontalWheelEvent(wheelDelta) : generateVerticalWheelEvent(wheelDelta);
}

function triggerWheelEvent(event) {
  const signal = generateWheelEvent(event);
  trigger(catcher, signal, false, 'UIEvent');
}

function triggerMoveEvent() {
  const data = generateMoveEventData();
  trigger(catcher, names.shift, false, 'UIEvent', data);
}

function onWheel(event) {
  requestAnimationFrame(() => {
    triggerWheelEvent(event);
  });
}

function onMouseMove(event) {
  requestAnimationFrame(() => {
    savePosition();
    updatePosition(event);
    triggerMoveEvent();
  });
}

function onMouseUp() {
  unsubscribeMouse();
}

function subscribeMouse() {
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

function unsubscribeMouse() {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}

function onMouseDown(event) {
  updatePosition(event);
  subscribeMouse();
}

function subscribe() {
  catcher.addEventListener('wheel', onWheel);
  catcher.addEventListener('mousedown', onMouseDown);
}

export default function init(node) {
  catcher = node;
  subscribe();
}
