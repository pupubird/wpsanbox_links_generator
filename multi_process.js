const start = require("./index");
let x = 70;
for (let i = 0; i < x / 10; i++) {
  start(i, x / 10);
}
