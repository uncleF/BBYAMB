import { names, trigger } from 'signal';

const stack = [];

let catcher;

let ui;
let buttonRotateCCW;
let buttonRotateCW;
let buttonZoomIn;
let buttonZoomOut;
let buttonTarget;
let buttonSwitch;
let buttonFullScreen;
let buttonHelp;

function deactivateSwitch() {
  buttonSwitch.classList.remove('buttonSwitch-is-on');
}

function activateSwitch() {
  buttonSwitch.classList.add('buttonSwitch-is-on');
}

function toggleSwitch(status) {
  if (!status) deactivateSwitch();
  else activateSwitch();
}

function deactivateFullScreen() {
  buttonFullScreen.classList.remove('buttonFullScreen-is-on');
}

function activateFullscreen() {
  buttonFullScreen.classList.add('buttonFullScreen-is-on');
}

function toggleFullScreen(status) {
  if (status) activateFullscreen();
  else deactivateFullScreen();
}

function hasFeedback(target) {
  return target.classList.contains('button-has-feedback');
}

function updateFeedbackStack() {
  const button = stack.pop();
  button.classList.remove('button-has-feedback');
}

function retriggerFeedback(button) {
  const index = stack.indexOf(button);
  stack.splice(index, 1);
  button.classList.remove('button-has-feedback');
}

function triggerFeedback(button) {
  if (hasFeedback(button)) retriggerFeedback(button);
  button.classList.add('button-has-feedback');
  stack.push(button);
}

function triggerControlFeedback(data) {
  if (data.scale) {
    if (data.distance > 0) triggerFeedback(buttonZoomIn);
    else triggerFeedback(buttonZoomOut);
  } else if (data.rotate) {
    if (data.distance > 0) triggerFeedback(buttonRotateCCW);
    else triggerFeedback(buttonRotateCW);
  }
}

function findElements() {
  ui = catcher.querySelector('#ui');
  buttonRotateCCW = ui.querySelector('#buttonRotateCCW');
  buttonRotateCW = ui.querySelector('#buttonRotateCW');
  buttonZoomIn = ui.querySelector('#buttonZoomIn');
  buttonZoomOut = ui.querySelector('#buttonZoomOut');
  buttonTarget = ui.querySelector('#buttonTarget');
  buttonSwitch = ui.querySelector('#buttonSwitch');
  buttonFullScreen = ui.querySelector('#buttonFullScreen');
  buttonHelp = ui.querySelector('#buttonHelp');
}

function onRotateCCWClick(event) {
  event.preventDefault();
  trigger(catcher, names.shiftleft, false, 'UIEvent', { rotate: true, oneWay: true });
}

function onRotateCWClick(event) {
  event.preventDefault();
  trigger(catcher, names.shiftright, false, 'UIEvent', { rotate: true, oneWay: true });
}

function onZoomInClick(event) {
  event.preventDefault();
  trigger(catcher, names.shiftup, false, 'UIEvent', { scale: true, oneWay: true });
}

function onZoomOutClick(event) {
  event.preventDefault();
  trigger(catcher, names.shiftdown, false, 'UIEvent', { scale: true, oneWay: true });
}

function onTargetClick(event) {
  event.preventDefault();
  trigger(catcher, names.focus, false, 'UIEvent', { oneWay: true });
}

function onSwitchClick(event) {
  event.preventDefault();
  trigger(catcher, names.switch, false, 'UIEvent', { oneWay: true });
}

function onFullScreenClick(event) {
  event.preventDefault();
  trigger(catcher, names.fullscreen, false, 'UIEvent', { oneWay: true });
}

function onHelpClick(event) {
  event.preventDefault();
  trigger(catcher, names.helpshow, false, 'UIEvent', { oneWay: true });
}

function onShifted(event) {
  if (!event.data.oneWay) triggerControlFeedback(event.data);
}

function onFocused(event) {
  if (!event.data.oneWay) triggerFeedback(buttonTarget);
}

function onSwitched(event) {
  toggleSwitch(event.data.status);
  if (!event.data.oneWay) triggerFeedback(buttonTarget);
}

function onMaximized(event) {
  toggleFullScreen(event.data.status);
  triggerFeedback(buttonFullScreen);
}

function onHelpToggled(event) {
  if (!event.data.oneWay && event.data.status) triggerFeedback(buttonHelp);
}

function onTransition(event) {
  const { target } = event;
  if (hasFeedback(target)) updateFeedbackStack();
}

function subscribeButtons() {
  buttonRotateCCW.addEventListener('click', onRotateCCWClick);
  buttonRotateCW.addEventListener('click', onRotateCWClick);
  buttonZoomIn.addEventListener('click', onZoomInClick);
  buttonZoomOut.addEventListener('click', onZoomOutClick);
  buttonTarget.addEventListener('click', onTargetClick);
  buttonSwitch.addEventListener('click', onSwitchClick);
  buttonFullScreen.addEventListener('click', onFullScreenClick);
  buttonHelp.addEventListener('click', onHelpClick);
}

function subscribeEvents() {
  catcher.addEventListener(names.shifted, onShifted);
  catcher.addEventListener(names.focused, onFocused);
  catcher.addEventListener(names.switched, onSwitched);
  catcher.addEventListener(names.maximized, onMaximized);
  catcher.addEventListener(names.helptoggled, onHelpToggled);
  ui.addEventListener('transitionend', onTransition);
}

export default function init(node) {
  catcher = node;
  findElements();
  subscribeButtons();
  subscribeEvents();
}
