/**
 * CRASelectionTracker — Text selection event tracking
 *
 * Monitors mouse events and selection changes, emits selection events.
 *
 * Dependencies: CRADom, CRAEventBus, CRAEvents
 */
((required) => {
  for (const [name, ref] of Object.entries(required)) {
    if (!ref) throw new Error(`[CRA] ${name} not loaded — check manifest.json order`);
  }
})({ CRADom: window.CRADom, CRAEventBus: window.CRAEventBus, CRAEvents: window.CRAEvents });

window.CRASelectionTracker = {
  create(deps) {
    const dom = deps.dom;
    const eventBus = deps.eventBus;
    const Events = deps.events;

    let active = false;
    let debounceTimer = null;
    const DEBOUNCE_MS = 200;

    function handleMouseUp() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        try {
          const selection = window.getSelection();
          if (!selection || selection.isCollapsed || !selection.toString().trim()) {
            eventBus.emit(Events.SELECTION_CLEARED);
            return;
          }
          if (selection.rangeCount === 0) return;

          const text = selection.toString().trim();
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          if (rect.width === 0 && rect.height === 0) return;

          const container = dom.getConversationContainer();
          if (container && !container.contains(range.commonAncestorContainer)) {
            return;
          }

          eventBus.emit(Events.SELECTION_MADE, {
            text,
            rect: {
              top: rect.top,
              bottom: rect.bottom,
              left: rect.left,
              right: rect.right,
              width: rect.width,
              height: rect.height,
            },
            range,
          });
        } catch (e) {
          // Silently ignore selection errors
        }
      }, DEBOUNCE_MS);
    }

    function handleSelectionChange() {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          eventBus.emit(Events.SELECTION_CLEARED);
        }, 100);
      }
    }

    function init() {
      if (active) return;
      document.addEventListener('mouseup', handleMouseUp, true);
      document.addEventListener('selectionchange', handleSelectionChange, true);
      active = true;
    }

    function update() {}

    function destroy() {
      document.removeEventListener('mouseup', handleMouseUp, true);
      document.removeEventListener('selectionchange', handleSelectionChange, true);
      clearTimeout(debounceTimer);
      active = false;
    }

    function getDiagnostics() { return { active }; }

    return { init, update, destroy, getDiagnostics };
  },
};
