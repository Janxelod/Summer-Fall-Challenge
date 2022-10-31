class ClearingLogger {
  constructor(elem) {
    this.elem = elem;
    this.lines = [];
  }
  log(...args) {
    this.lines.push([...args].join(" "));
  }
  tick(delta) {
    this.elem.textContent = this.lines.join("\n");
    this.lines = [];
  }
}

export { ClearingLogger };
