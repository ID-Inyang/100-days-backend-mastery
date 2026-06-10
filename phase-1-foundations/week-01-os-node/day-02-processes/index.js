// This keeps the process alive by printing a heartbeat every 2 seconds
const heartbeat = setInterval(() => {
  console.log('Server is running... (Press Ctrl+C to stop)');
}, 2000);

// Your Signal Handler
process.on('SIGINT', () => {
  console.log('\n[SIGNAL] Caught SIGINT (Ctrl+C). Cleaning up...');
  
  // Clear the interval so the event loop can naturally empty out
  clearInterval(heartbeat);
  
  console.log('Cleanup complete. Exiting safely.');
  process.exit(0);
});