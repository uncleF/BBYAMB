import { names, trigger } from 'signal';

let catcher;

let bike;
let parts;
let partFrontWheel;
let partRearWheel;
let partFrame;
let partFork;

let active;

function isActive(target) {
  return target === active;
}

function matchPart(element) {
  const className = element.getAttribute('class');
  return className.match(/bikePart/);
}

function findTarget(event) {
  const { target } = event;
  let element;
  if (matchPart(target)) element = target;
  else if (matchPart(target.parentElement)) element = target.parentElement;
  return element;
}

function pickDetail(target) {
  let detail;
  if (target === partFrontWheel) detail = 1;
  else if (target === partFork) detail = 2;
  else if (target === partFrame) detail = 3;
  else detail = 4;
  return detail;
}

function pickPart(option) {
  let part;
  if (option === 1) part = partFrontWheel;
  else if (option === 2) part = partFork;
  else if (option === 3) part = partFrame;
  else part = partRearWheel;
  return part;
}

function triggerEvent(target) {
  const detail = pickDetail(target);
  trigger(catcher, names.detail, false, 'UIEvent', { detail });
}

function addClassPart(element, newClassName) {
  const className = element.getAttribute('class');
  element.setAttribute('class', `${className} ${newClassName}`);
}

function removeClassPart(element, oldClassName) {
  const regexp = new RegExp(`\\s*${oldClassName}`, 'g');
  const className = element.getAttribute('class');
  const newClassName = className.replace(regexp, '');
  element.setAttribute('class', newClassName);
}

function deactivatePart() {
  removeClassPart(active, 'bikePart-is-active');
  active = null;
}

function activatePart(detail) {
  const part = pickPart(detail);
  addClassPart(part, 'bikePart-is-active');
  active = part;
}

function activateFirstPart() {
  activatePart(1);
}

function highlightPart(target) {
  bike.classList.add('bike-is-highlighting');
  addClassPart(target, 'bikePart-is-highlighted');
}

function unhighlightPart(target) {
  bike.classList.remove('bike-is-highlighting');
  removeClassPart(target, 'bikePart-is-highlighted');
}

function findParts() {
  bike = catcher.querySelector('#bike');
  partFrontWheel = bike.querySelector('#bikeFrontWheel');
  partRearWheel = bike.querySelector('#bikeRearWheel');
  partFrame = bike.querySelector('#bikeFullFrame');
  partFork = bike.querySelector('#bikeFork');
  parts = [partFrontWheel, partRearWheel, partFrame, partFork];
}

function onPointerDown(event) {
  const target = findTarget(event);
  if (!isActive(target)) triggerEvent(target);
}

function onMouseEnter(event) {
  const target = findTarget(event);
  highlightPart(target);
}

function onMouseLeave(event) {
  const target = findTarget(event);
  unhighlightPart(target);
}

function onSwitched(event) {
  if (event.data.status) activateFirstPart();
  else deactivatePart();
}

function onDetailPicked(event) {
  if (active) deactivatePart();
  activatePart(event.data.detail);
}

function subscribePart(part) {
  part.addEventListener('click', onPointerDown);
  part.addEventListener('touchstart', onPointerDown);
  part.addEventListener('mouseenter', onMouseEnter);
  part.addEventListener('mouseleave', onMouseLeave);
}

function subscribeParts() {
  parts.forEach(subscribePart);
}

function subscribeEvents() {
  catcher.addEventListener(names.switched, onSwitched);
  catcher.addEventListener(names.detailpicked, onDetailPicked);
}

export default function init(node) {
  catcher = node;
  findParts();
  subscribeParts();
  subscribeEvents();
}
