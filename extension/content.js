console.log('Content script loaded');

let intervalId = null;
let monitoring = false;

async function sendToAPI() {
  if (!monitoring) return;

  console.log("Sending API call...");
  
  await fetch("http://127.0.0.1:8000/focus", {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    },
  })
  .then(r => r.json())
  .then(data => console.log("API Response:", data))
  .catch(err => console.log("API Error:", err));
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "START_MONITORING") {
    console.log("Start received");

    // First, start the camera on backend
    fetch("http://127.0.0.1:8000/start", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" }
    })
    .then(r => r.json())
    .then(data => {
      console.log("Backend started:", data);
      
      monitoring = true;
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(sendToAPI, 500);
      
      sendResponse({ status: 'started' });
    })
    .catch(err => {
      console.error("Failed to start backend:", err);
      sendResponse({ status: 'error', error: err.message });
    });

    return true; // Keep channel open for async response
  }

  if (msg.action === "STOP_MONITORING") {
    console.log("Stop received");

    monitoring = false;

    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    // Stop the camera on backend
    fetch("http://127.0.0.1:8000/stop", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" }
    })
    .then(r => r.json())
    .then(data => {
      console.log("Backend stopped:", data);
      sendResponse({ status: 'stopped' });
    })
    .catch(err => {
      console.error("Failed to stop backend:", err);
      sendResponse({ status: 'error', error: err.message });
    });

    return true; // Keep channel open for async response
  }

  return true;
});