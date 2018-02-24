/* eslint no-use-before-define: 'off' */

import { names, trigger } from 'signal';

const PINCH_THRESHOLD = 25;
const PIXEL_RATIO = window.devicePixelRatio || 1;
const ADJUSTED_PINCH_THRESHOLD = PINCH_THRESHOLD * PIXEL_RATIO;

let catcher;

let count = 0;

let movePrevious;
let moveCurrent;

let spaceStart;
let spaceCurrent;

function subtractTouch() {
  count -= 1;
}

function addTouch() {
  count += 1;
}

function savePosition() {
  movePrevious = moveCurrent;
}

function updatePosition(touch) {
  return {
    x: touch.clientX,
    y: touch.clientY,
  };
}

function updatePositions(event) {
  moveCurrent = event.touches.map(updatePosition);
}

function calculateDistance() {
  const [ current ] = moveCurrent;
  const [ previous ] = movePrevious;
  return {
    x: current.x - previous.x,
    y: current.y - previous.y,
  };
}

function calculateSpaceBetween(event) {
  const { touches } = event;
  const x1 = touches[0].clientX;
  const y1 = touches[0].clientY;
  const x2 = touches[1].clientX;
  const y2 = touches[1].clientY;
  return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

function calculateSpaceChange() {
  return spaceCurrent - spaceStart;
}

function generateEvent() {
  const data = {};
  let name;
  if (count > 1) {
    data.distance = calculateDistance();
    name = names.shift;
  } else if (spaceStart > ADJUSTED_PINCH_THRESHOLD) {
    data.change = calculateSpaceChange();
    name = names.pinch;
  } else {
    data.distance = calculateDistance();
    name = names.drag;
  }
  return { name, data };
}

function triggerEvent() {
  const signal = generateEvent();
  trigger(catcher, signal.name, false, 'UIEvent', signal.data);
}

function onTouchMove(event) {
  requestAnimationFrame(() => {
    savePosition();
    if (count > 1 && spaceStart > ADJUSTED_PINCH_THRESHOLD) spaceCurrent = calculateSpaceBetween(event);
    else updatePositions(event);
    triggerEvent();
  });
}

function onTouchEnd() {
  subtractTouch();
  if (!count) unsubscribeTouch();
}

function subscribeTouch() {
  document.addEventListener('touchmove', onTouchMove);
  document.addEventListener('touchend', onTouchEnd);
}

function unsubscribeTouch() {
  document.removeEventListener('touchmove', onTouchMove);
  document.removeEventListener('touchend', onTouchEnd);
}

function onTouchStart(event) {
  unsubscribeTouch();
  updatePositions(event);
  if (!count) subscribeTouch();
  if (count > 1) spaceStart = calculateSpaceBetween(event);
  addTouch();
}

function subscribe() {
  catcher.addEventListener('touchstart', onTouchStart);
}

export default function init(node) {
  catcher = node;
  subscribe();
}
