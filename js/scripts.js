const stream = document.getElementById("stream");
const video = document.getElementById("bgVideo");
const visible = document.getElementById("visible");
const mute = document.getElementById("mute");
const text = document.getElementById("text");

// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
const KEYS_TO_IGNORE = [
  // special values
  "Unidentified",
  // modifier keys
  "Alt", "AltGraph", "CapsLock", "Control", "Fn", "FnLock", "Hyper", "Meta", "OS",
  "NumLock", "Scroll", "ScrollLock", "Shift", "Super", "Symbol", "SymbolLock",
  // whitespace keys
  "Enter", "Tab",
  // navigation keys
  "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp",
  "Down", "Left", "Right", "Up",
  "End", "Home", "PageDown", "PageUp",
  // editing keys
  "Delete", "Del",
  // ui keys
  "ContextMenu", "Apps", "Esc", "Escape", "Find", "Help",
  // device keys
  "Eject", "PrintScreen", "PrtScr", "Snapshot",
  // ime and composition keys
  "Dead",
  // function keys
  "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10",
  "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20"
];

let thoughts = [];
var current = newThought();
let interval = 0;

function newThought() {
  if (current) {
    current.classList.remove("current");
    thoughts.push([current, 0.5]); // velocity
  }
  let p = document.createElement("p");
  p.classList.add("thought", "current");
  p.style.transform = "translateX(0px)";
  stream.append(p);
  return p;
}

document.addEventListener("keydown", event => {
  interval = 0;
  let k = event.key;
  if (KEYS_TO_IGNORE.includes(k)) {
    return;
  } else if (k === "Backspace" || k === "Clear" || k === "'" || k == "/") {
    if (k === "Backspace") {
      current.textContent = current.textContent.substring(0, current.textContent.length - 1);
    } else if (k === "Clear") {
      current.textContent = "";
    } else if (k === "'" || k === "/") {
      current.textContent += k;
    }
    event.preventDefault();
  } else {
    current.textContent += event.key;
  }
});

// move thoughts across screen
setInterval(() => {
  if (current.textContent.length > 0) {
    interval += 1;
    if (interval > 50) {
      current = newThought();
    }
  }

  for (let i = thoughts.length - 1; i >= 0; i--) {
    // https://zellwk.com/blog/css-translate-values-in-javascript/
    const style = window.getComputedStyle(thoughts[i][0]);
    const matrix = style.transform || style.webkitTransform || style.mozTransform;
    if (matrix) {
      const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');
      const x = Number(matrixValues[4]);
      if (x > window.innerWidth) {
        thoughts[i][0].remove();
      } else {
        thoughts[i][0].style.transform = `translateX(${x + thoughts[i][1]}px)`;
        thoughts[i][1] += 0.01;
      }
    }
  }
}, 10);

// toggles

visible.addEventListener("click", event => {
  visible.textContent = (text.classList.contains("hidden")) ? "Hide text" : "Show text";
  text.classList.toggle("hidden");
});

mute.addEventListener("click", event => {
  mute.textContent = (bgVideo.muted) ? "Mute" : "Unmute";
  bgVideo.muted = !bgVideo.muted;
});