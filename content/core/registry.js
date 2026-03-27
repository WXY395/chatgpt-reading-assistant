/**
 * CRAModuleRegistry — Module lifecycle management with dependency injection
 *
 * Modules are registered as factory functions that receive dependencies.
 * The registry manages init/update/destroy lifecycle for all modules.
 *
 * Usage:
 *   CRAModuleRegistry.register('toolbar', (deps) => {
 *     return CRASelectionToolbar.create({ eventBus: deps.eventBus, ... });
 *   });
 *   CRAModuleRegistry.initAll(settings, deps);
 *
 * Dependencies: none
 */
((required) => {
  for (const [name, ref] of Object.entries(required)) {
    if (!ref) throw new Error(`[CRA] ${name} not loaded — check manifest.json order`);
  }
})({});

window.CRAModuleRegistry = (() => {
  const modules = new Map();

  /**
   * Register a module.
   *
   * @param {string} name - Unique module name
   * @param {Function|Object} factoryOrModule
   *   - Function: called with (deps) at init time, must return module object
   *   - Object: legacy direct module (must implement init/update/destroy)
   */
  function register(name, factoryOrModule) {
    if (modules.has(name)) {
      console.warn(`[CRA] Module "${name}" already registered, replacing.`);
    }
    modules.set(name, {
      factory: typeof factoryOrModule === 'function' ? factoryOrModule : null,
      module: typeof factoryOrModule === 'function' ? null : factoryOrModule,
      initialized: false,
    });
  }

  /**
   * Initialize all registered modules.
   *
   * @param {Object} settings - Current settings
   * @param {Object} [deps] - Shared dependencies to inject into factory functions
   */
  function initAll(settings, deps) {
    for (const [name, entry] of modules) {
      if (entry.initialized) continue;
      try {
        // If factory, create module instance first
        if (entry.factory && !entry.module) {
          entry.module = entry.factory(deps || {});
        }
        if (entry.module && entry.module.init) {
          entry.module.init(settings);
        }
        entry.initialized = true;
        console.log(`[CRA] Module "${name}" initialized`);
      } catch (e) {
        console.error(`[CRA] Failed to init module "${name}":`, e);
      }
    }
  }

  function updateAll(settings) {
    for (const [name, entry] of modules) {
      if (entry.initialized && entry.module) {
        try {
          entry.module.update(settings);
        } catch (e) {
          console.error(`[CRA] Failed to update module "${name}":`, e);
        }
      }
    }
  }

  function destroyAll() {
    for (const [name, entry] of modules) {
      if (entry.initialized && entry.module) {
        try {
          entry.module.destroy();
          entry.initialized = false;
        } catch (e) {
          console.error(`[CRA] Failed to destroy module "${name}":`, e);
        }
      }
    }
  }

  function get(name) {
    const entry = modules.get(name);
    return entry ? entry.module : null;
  }

  function getDiagnostics() {
    const diag = {};
    for (const [name, entry] of modules) {
      diag[name] = {
        initialized: entry.initialized,
        diagnostics:
          entry.initialized && entry.module && entry.module.getDiagnostics
            ? entry.module.getDiagnostics()
            : null,
      };
    }
    return diag;
  }

  return { register, initAll, updateAll, destroyAll, get, getDiagnostics };
})();
