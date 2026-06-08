// async.js
console.log("Start");

function yieldAsync(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log("Before yield");
  await yieldAsync(1000); // yields — other tasks can run
  console.log("After yield — event loop was free during the wait!");
}

main();
console.log("This runs before 'After yield' — proof the loop wasn't blocked");