/**
 * ChatGPTReadingAssistant — Main orchestrator (pure orchestration)
 *
 * Responsibilities:
 *   1. Check supported page
 *   2. Load settings
 *   3. Assemble dependency graph
 *   4. Register modules with DI
 *   5. Start SPA observer + runtime handler
 *   6. Log diagnostics
 *
 * Dependencies: All modules must be loaded before this file.
 */
((required) => {
  for (const [name, ref] of Object.entries(required)) {
    if (!ref) throw new Error(`[CRA] ${name} not loaded — check manifest.json order`);
  }
})({
  CRAStorage: window.CRAStorage,
  CRAEventBus: window.CRAEventBus,
  CRAEvents: window.CRAEvents,
  CRAUIHelpers: window.CRAUIHelpers,
  CRAMarkdown: window.CRAMarkdown,
  CRADom: window.CRADom,
  CRAModuleRegistry: window.CRAModuleRegistry,
  CRAMessageScanner: window.CRAMessageScanner,
  CRAInputIntegration: window.CRAInputIntegration,
  CRASelectionTracker: window.CRASelectionTracker,
  CRASelectionToolbar: window.CRASelectionToolbar,
  CRACitationClipboard: window.CRACitationClipboard,
  CRARuntimeHandler: window.CRARuntimeHandler,
  CRASpaObserver: window.CRASpaObserver,
});

window.ChatGPTReadingAssistant = (() => {
  let settings = null;
  let initialized = false;

  // Shared dependencies — assembled once, injected into all modules
  const deps = {
    dom: CRADom,
    eventBus: CRAEventBus,
    events: CRAEvents,
    storage: CRAStorage,
    ui: CRAUIHelpers,
    markdown: CRAMarkdown,
    // Module instances (populated during init)
    inputIntegration: null,
    messageScanner: null,
  };

  function isSupportedPage() {
    const host = window.location.hostname;
    return host === 'chatgpt.com' || host === 'chat.openai.com';
  }

  async function init() {
    if (initialized) return;
    if (!isSupportedPage()) {
      console.log('[CRA] Not a supported page, skipping init');
      return;
    }

    console.log('[CRA] Initializing ChatGPT Reading Assistant...');

    // Load settings
    settings = await CRAStorage.getSettings();

    if (!settings.extensionEnabled) {
      console.log('[CRA] Extension disabled in settings');
      return;
    }

    // Register modules with factory functions (DI)
    CRAModuleRegistry.register('messageScanner', (d) => {
      const instance = CRAMessageScanner.create(d);
      deps.messageScanner = instance;
      return instance;
    });

    CRAModuleRegistry.register('inputIntegration', (d) => {
      const instance = CRAInputIntegration.create(d);
      deps.inputIntegration = instance;
      // Also add to deps so later modules can use it
      d.input = instance;
      return instance;
    });

    CRAModuleRegistry.register('selectionTracker', (d) => {
      return CRASelectionTracker.create(d);
    });

    CRAModuleRegistry.register('selectionToolbar', (d) => {
      return CRASelectionToolbar.create(d);
    });

    CRAModuleRegistry.register('citationClipboard', (d) => {
      return CRACitationClipboard.create(d);
    });

    // Initialize all modules (factory functions receive deps)
    CRAModuleRegistry.initAll(settings, deps);

    // Attach runtime message handler
    CRARuntimeHandler.attach({
      onSettingsUpdate: onSettingsUpdate,
      getSettings: () => settings,
      getDiagnostics: () => CRAModuleRegistry.getDiagnostics(),
      inputIntegration: deps.inputIntegration,
      messageScanner: deps.messageScanner,
      citationClipboard: CRAModuleRegistry.get('citationClipboard'),
    });

    // Start SPA navigation observer
    CRASpaObserver.start((url) => {
      if (deps.messageScanner) {
        deps.messageScanner.update();
        console.log('[CRA] Post-navigation rescan:', deps.messageScanner.getMessageCount(), 'messages');
      }
    });

    // Log diagnostics after React renders
    setTimeout(() => logDiagnostics(), 1500);

    initialized = true;
    console.log('[CRA] Initialization complete');
  }

  async function onSettingsUpdate(newSettings) {
    settings = await CRAStorage.saveSettings(newSettings);

    if (!settings.extensionEnabled) {
      CRAModuleRegistry.destroyAll();
    } else {
      CRAModuleRegistry.initAll(settings, deps);
      CRAModuleRegistry.updateAll(settings);
    }
  }

  function logDiagnostics() {
    const diag = CRAModuleRegistry.getDiagnostics();
    console.log('[CRA] Diagnostics:', JSON.stringify(diag, null, 2));
    console.log('[CRA] DOM Detection:', {
      conversationContainer: !!CRADom.getConversationContainer(),
      inputBox: !!CRADom.getInputBox(),
      sendButton: !!CRADom.getSendButton(),
      messageTurns: CRADom.getAllMessageTurns().length,
      isStreaming: CRADom.isStreamingActive(),
    });
  }

  function destroy() {
    CRAModuleRegistry.destroyAll();
    CRARuntimeHandler.detach();
    CRASpaObserver.stop();
    initialized = false;
  }

  return { init, destroy, logDiagnostics };
})();

// ── Bootstrap ──
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ChatGPTReadingAssistant.init());
} else {
  ChatGPTReadingAssistant.init();
}
