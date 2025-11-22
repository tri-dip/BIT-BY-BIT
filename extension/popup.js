function getActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs && tabs[0]);
    });
  });
}

function injectContentScript(tabId) {
  return new Promise((resolve, reject) => {
    if (!chrome.scripting) return reject(new Error('scripting API not available'));
    chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] }, () => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
      resolve();
    });
  });
}

function sendMessageWithInject(tabId, message) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, message, async (response) => {
      if (chrome.runtime.lastError) {
        const err = chrome.runtime.lastError.message || '';
        console.warn('sendMessage error:', err);
        if (err.includes('Receiving end does not exist')) {
          try {
            await injectContentScript(tabId);
            // retry once
            chrome.tabs.sendMessage(tabId, message, (resp2) => {
              if (chrome.runtime.lastError) {
                console.error('Retry sendMessage error:', chrome.runtime.lastError.message);
                resolve({ success: false, error: chrome.runtime.lastError.message });
              } else {
                resolve({ success: true, response: resp2 });
              }
            });
          } catch (e) {
            console.error('Injection failed:', e);
            resolve({ success: false, error: e && e.message ? e.message : String(e) });
          }
        } else {
          resolve({ success: false, error: err });
        }
      } else {
        resolve({ success: true, response });
      }
    });
  });
}

document.getElementById('startBtn').addEventListener('click', async () => {
  const tab = await getActiveTab();
  if (!tab) return console.error('No active tab found');

  const result = await sendMessageWithInject(tab.id, { action: 'START_MONITORING' });
  if (!result.success) console.error('Failed to start monitoring:', result.error);

  document.getElementById('startBtn').disabled = true;
  document.getElementById('stopBtn').disabled = false;
});

document.getElementById('stopBtn').addEventListener('click', async () => {
  const tab = await getActiveTab();
  if (!tab) return console.error('No active tab found');

  const result = await sendMessageWithInject(tab.id, { action: 'STOP_MONITORING' });
  if (!result.success) console.error('Failed to stop monitoring:', result.error);

  document.getElementById('startBtn').disabled = false;
  document.getElementById('stopBtn').disabled = true;
});
