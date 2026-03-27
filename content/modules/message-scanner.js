/**
 * CRAMessageScanner — Message detection and indexing via MutationObserver
 *
 * Dependencies: CRADom, CRAEventBus, CRAEvents
 */
((required) => {
  for (const [name, ref] of Object.entries(required)) {
    if (!ref) throw new Error(`[CRA] ${name} not loaded — check manifest.json order`);
  }
})({ CRADom: window.CRADom, CRAEventBus: window.CRAEventBus, CRAEvents: window.CRAEvents });

window.CRAMessageScanner = {
  create(deps) {
    const dom = deps.dom;
    const eventBus = deps.eventBus;
    const Events = deps.events;

    let messages = [];
    let observer = null;
    let rescanTimer = null;
    const DEBOUNCE_MS = 300;

    function scan() {
      const turns = dom.getAllMessageTurns();
      messages = [];

      turns.forEach((turn, i) => {
        const role = dom.getMessageRole(turn);
        const text = dom.getMessageText(turn);
        const turnIndex = dom.getTurnIndex(turn);
        turn.setAttribute('data-cra-index', i);

        messages.push({
          index: i,
          turnIndex,
          role,
          text: text.slice(0, 200),
          element: turn,
        });
      });

      eventBus.emit(Events.MESSAGES_SCANNED, { count: messages.length, messages });
      return messages;
    }

    function getMessages() { return messages; }
    function getMessageCount() { return messages.length; }

    function startObserving() {
      if (observer) return;
      const target = dom.getConversationContainer() || document.body;

      observer = new MutationObserver(() => {
        clearTimeout(rescanTimer);
        rescanTimer = setTimeout(() => scan(), DEBOUNCE_MS);
      });

      observer.observe(target, { childList: true, subtree: true });
      scan();
    }

    function stopObserving() {
      if (observer) { observer.disconnect(); observer = null; }
      clearTimeout(rescanTimer);
    }

    function init() { startObserving(); }
    function update() { stopObserving(); startObserving(); }
    function destroy() { stopObserving(); messages = []; }
    function getDiagnostics() {
      return {
        messageCount: messages.length,
        observing: !!observer,
        containerFound: !!dom.getConversationContainer(),
      };
    }

    return { init, update, destroy, getDiagnostics, scan, getMessages, getMessageCount };
  },
};
