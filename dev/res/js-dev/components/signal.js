export const names = {
  shiftleft: 'bbb:shiftleft',
  shiftright: 'bbb:shiftright',
  shiftup: 'bbb:shiftup',
  shiftdown: 'bbb:shiftdown',
  shift: 'bbb:shift',
  shifted: 'bbb:shifted',
  drag: 'bbb:drag',
  pinch: 'bbb:pinch',
  switch: 'bbb:switch',
  switched: 'bbb:switched',
  detail: 'bbb:detail',
  detailpicked: 'bbb:detailpicked',
  focus: 'bbb:focus',
  focused: 'bbb:focused',
  fullscreen: 'bbb:fullscreen',
  maximized: 'bbb:maximized',
  help: 'bbb:help',
  helptoggled: 'bbb:helptoggled',
};

function setData(event, data) {
  const newEvent = event;
  newEvent.data = data;
  return newEvent;
}

function triggerCreateEvent(object, eventName, propagate, eventType, data) {
  const event = document.createEvent(eventType);
  if (data) setData(event, data);
  event.initEvent(eventName, propagate, false);
  object.dispatchEvent(event);
}

function triggerCreateEventObject(object, eventName, propagate, data) {
  const event = document.createEventObject();
  if (data) setData(event, data);
  object.fireEvent(`on${eventName}`, event);
}

export function trigger(object, eventName, propagate = false, eventType = 'UIEvent', data) {
  if (document.createEvent) {
    triggerCreateEvent(object, eventName, propagate, eventType, data);
  } else {
    triggerCreateEventObject(object, eventName, propagate, data);
  }
}
