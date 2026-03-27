/**
 * CRA Event Constants — Centralized event name registry
 *
 * All event names used across modules are defined here.
 * This prevents magic strings and enables IDE autocomplete.
 */
window.CRAEvents = Object.freeze({
  // CRAMessageScanner
  MESSAGES_SCANNED: 'messages:scanned',

  // CRASelectionTracker
  SELECTION_MADE: 'selection:made',
  SELECTION_CLEARED: 'selection:cleared',

  // CRASelectionToolbar → CRACitationClipboard
  CITATION_ADD: 'citation:add',
});
