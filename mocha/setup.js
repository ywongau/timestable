
const _require = require("jsdom"),
  JSDOM = _require.JSDOM;

const jsdom = new JSDOM("<!doctype html><html><body></body></html>");
const window = jsdom.window;

const copyProps = (src, target) => {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === "undefined")
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
};

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: "node.js"
};
copyProps(window, global);
