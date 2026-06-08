// blocking.js
console.log("Start");

const start = Date.now();
while (Date.now() - start < 5000) {} // blocks for 5 seconds

console.log("End — nothing else could run while blocked!");