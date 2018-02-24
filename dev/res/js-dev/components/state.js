import { names, trigger } from 'signal';

let catcher;

let switched = false;
let maximized = false;

function toggleSwitch() {
  switched = !switched;
}

function exitFullScreen() {
  document.webkitCancelFullScreen();
}

function enterFullScreen() {
  document.documentElement.webkitRequestFullScreen();
}

function toggleFullScreen() {
  if (maximized) exitFullScreen();
  else enterFullScreen();
}

function triggerFeedbackEvent(name, originalData = {}, additionalData = {}) {
  const data = Object.assign({}, originalData, additionalData);
  trigger(catcher, name, false, 'UIEvent', data);
}

function onShift(event) {
  triggerFeedbackEvent(names.shifted, event.data);
}

function onSwitch(event) {
  toggleSwitch();
  triggerFeedbackEvent(names.switched, event.data, { status: switched });
}

function onDetail(event) {
  if (!switched) onSwitch(event);
  triggerFeedbackEvent(names.detailpicked, event.data);
}

function onFocus(event) {
  triggerFeedbackEvent(names.focused, event.data);
}

function onFullScreen() {
  toggleFullScreen();
}

function onHelp(event) {
  triggerFeedbackEvent(names.helptoggled, event.data);
}

function onFullScreenChange() {
  maximized = document.webkitIsFullScreen;
  triggerFeedbackEvent(names.maximized, {}, { status: maximized });
}

function subscribe() {
  catcher.addEventListener(names.shiftleft, onShift);
  catcher.addEventListener(names.shiftright, onShift);
  catcher.addEventListener(names.shiftup, onShift);
  catcher.addEventListener(names.shiftdown, onShift);
  catcher.addEventListener(names.shift, onShift);
  catcher.addEventListener(names.drag, onShift);
  catcher.addEventListener(names.pinch, onShift);
  catcher.addEventListener(names.switch, onSwitch);
  catcher.addEventListener(names.detail, onDetail);
  catcher.addEventListener(names.focus, onFocus);
  catcher.addEventListener(names.fullscreen, onFullScreen);
  catcher.addEventListener(names.help, onHelp);
  document.addEventListener('webkitfullscreenchange', onFullScreenChange);
}

export default function init(node) {
  catcher = node;
  subscribe();
}
