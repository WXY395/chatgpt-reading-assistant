// ChatGPT Reading Assistant - Background Service Worker

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[CRA] Extension installed');
  } else if (details.reason === 'update') {
    console.log('[CRA] Extension updated to', chrome.runtime.getManifest().version);
  }
});

// Relay messages between popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target === 'background') {
    // Handle background-specific messages if needed
    return;
  }

  // Forward messages from popup to active tab's content script
  if (message.target === 'content') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, message, sendResponse);
      }
    });
    return true; // async sendResponse
  }
});
