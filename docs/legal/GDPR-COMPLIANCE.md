# GDPR Compliance Statement — ChatGPT Reading Assistant

**Last updated:** 2026-03-28

## Overview

ChatGPT Reading Assistant ("CRA") is designed with privacy as a core principle. This document explains CRA's compliance with the General Data Protection Regulation (GDPR).

## Data Processing Summary

| Question | Answer |
|----------|--------|
| Does CRA collect personal data? | **No** |
| Does CRA transmit data externally? | **No** |
| Does CRA use cookies? | **No** |
| Does CRA use analytics/tracking? | **No** |
| Does CRA process data on external servers? | **No** |
| Where is data stored? | **Locally in the user's browser only** |

## GDPR Articles Addressed

### Article 5 — Principles
- **Data minimization:** CRA stores only what the user explicitly saves (text quotes and settings toggles). No implicit data collection.
- **Purpose limitation:** Stored data is used solely for the Extension's functionality (displaying saved quotes, applying settings).
- **Storage limitation:** Users can delete all data at any time via the Extension's settings panel or by uninstalling.

### Article 6 — Lawful Basis
CRA does not collect or process personal data, so no lawful basis for processing is required. The text snippets users choose to save are stored locally and never transmitted.

### Article 7 — Consent
No consent mechanism is required because CRA does not collect personal data. Users explicitly choose to save text snippets through a deliberate UI action (clicking "Collect").

### Article 12-14 — Transparency
- This document, along with PRIVACY.md, provides full transparency about data handling
- CRA's source code is open source and publicly auditable
- No hidden data flows exist

### Article 17 — Right to Erasure
Users can delete all CRA data at any time:
1. **Individual quotes:** Click the ✕ button on any quote in the citation panel
2. **All quotes:** Click "Clear All" in the citation panel or Extension popup
3. **Complete removal:** Uninstalling the Extension deletes all data

### Article 20 — Data Portability
Users can export all collected quotes:
- **JSON format:** Full data export via Extension popup → "📦 JSON" button
- **Markdown format:** Readable export via Extension popup → "📝 MD" button

### Article 25 — Data Protection by Design
- **Privacy by default:** CRA operates entirely offline with zero network connectivity
- **No external dependencies:** Zero third-party libraries that could introduce tracking
- **Local-only storage:** `chrome.storage.local` is sandboxed to the Extension and inaccessible to websites or other extensions

### Article 32 — Security
- Content scripts run in Chrome's isolated execution environment
- All HTML rendering uses proper escaping to prevent XSS
- No authentication tokens or credentials are processed
- See SECURITY.md for full security model documentation

### Article 33-34 — Breach Notification
Since CRA does not collect or transmit personal data, data breaches in the traditional sense cannot occur. If a security vulnerability is discovered in the Extension itself, it will be disclosed via SECURITY.md and a GitHub Security Advisory.

## Sub-Processors

CRA uses **zero** sub-processors. No data is shared with any third party.

## Data Protection Officer

Not applicable — CRA does not process personal data and is maintained by an individual/small team, not an organization subject to DPO requirements.

## Contact

For GDPR-related inquiries, please open an issue on the project's GitHub repository.

## Verification

Users can verify all claims in this document by:
1. Reviewing the open-source code
2. Monitoring the Network tab in Chrome DevTools while using CRA (zero external requests)
3. Searching the codebase for `fetch`, `XMLHttpRequest`, or `navigator.sendBeacon` (zero results)
