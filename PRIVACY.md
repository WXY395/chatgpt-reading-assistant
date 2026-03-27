# Privacy Policy — ChatGPT Reading Assistant (CRA)

**Last updated:** 2026-03-27

## Summary

ChatGPT Reading Assistant (CRA) does **not** collect, transmit, or share any user data. All data stays on your device.

## Data Collection

CRA does **not** collect:
- Personal information
- Browsing history
- Conversation content
- Analytics or telemetry data

## Data Storage

CRA stores the following data **locally** on your device using Chrome's `chrome.storage.local` API:
- **Settings** — Your module toggle preferences (e.g., toolbar on/off)
- **Quotes** — Text snippets you explicitly save to the citation clipboard

This data never leaves your browser. It is not synced to any cloud service or external server.

## Data Sharing

CRA does **not** share data with any third parties. There are no external API calls, tracking pixels, analytics services, or advertising networks.

## Permissions

- **storage** — Required to save your settings and collected quotes locally
- **Host permissions (chatgpt.com, chat.openai.com)** — Required to inject the content script that provides the toolbar and citation features on ChatGPT pages

## Data Deletion

You can delete all CRA data at any time:
1. Open the CRA popup and click "Clear" to remove all quotes
2. Uninstall the extension to remove all stored data

## Changes

If this privacy policy changes, the update will be reflected in this file with an updated date.

## Contact

For questions about this privacy policy, please open an issue on the project's GitHub repository.
