# Privacy Policy — ChatGPT Reading Assistant

**Last updated: 2026-03-31**

## Overview

ChatGPT Reading Assistant ("CRA") is a Chrome browser extension that enhances the reading experience on ChatGPT. This policy explains what data is handled and how.

---

## Data Collection

**CRA does not collect, transmit, or share any personal data.**

CRA has no servers, no analytics, no telemetry, and makes zero network requests of its own.

---

## Data Stored Locally

CRA stores the following data **exclusively on your device** using Chrome's `chrome.storage.local` API:

| Data | Purpose | Location |
|------|---------|----------|
| Saved quote entries (text + timestamp) | Citation clipboard feature | Your browser's local storage |
| Extension on/off state | Remember your preference | Your browser's local storage |

This data:
- Never leaves your device
- Is never synced to any cloud service
- Is never shared with any third party, including the extension developer
- Can be cleared at any time via the extension popup → "Clear All"

---

## Permissions Explained

| Permission | Why It's Needed |
|-----------|----------------|
| `storage` | Save your quotes and settings locally on your device |
| `host_permissions: chatgpt.com, chat.openai.com` | Inject the selection toolbar and citation panel into ChatGPT pages |

CRA requests the minimum permissions necessary. No tabs, history, cookies, identity, or network access is requested.

---

## Third-Party Services

CRA does not integrate with, send data to, or receive data from any third-party service.

The extension operates entirely within your browser and only activates on `chatgpt.com` and `chat.openai.com`.

---

## Children's Privacy

CRA does not knowingly collect data from anyone, including children under 13.

---

## Changes to This Policy

If this policy changes, the updated version will be published at this URL with a new "Last updated" date.

---

## Contact

If you have questions about this privacy policy, please open an issue at:
**https://github.com/WXY395/chatgpt-reading-assistant/issues**

---

*ChatGPT Reading Assistant is an independent open-source project and is not affiliated with OpenAI.*
