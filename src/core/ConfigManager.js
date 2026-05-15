class ConfigManager {
    constructor() {
        this.globalEnabled = true;
        this.featuresConfig = {};
        this.features = {}; // Registry for feature modules
    }

    // Register a feature module
    registerFeature(id, module) {
        this.features[id] = module;
    }

    // Initialize the manager, load config, and start features
    init() {
        // Load initial config
        chrome.storage.local.get(['globalEnabled', 'featuresConfig'], (result) => {
            if (result.globalEnabled !== undefined) {
                this.globalEnabled = result.globalEnabled;
            }
            if (result.featuresConfig !== undefined) {
                this.featuresConfig = result.featuresConfig;
            }
            this.applyConfig();
        });

        // Listen for updates from popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.command === "UPDATE_CONFIG") {
                this.globalEnabled = request.globalEnabled;
                this.featuresConfig = request.config;
                this.applyConfig();
                sendResponse({ status: "success" });
            }
        });
    }

    // Apply configuration to all registered features
    applyConfig() {
        console.log("GHN Helper Pro: Applying configuration", { global: this.globalEnabled, features: this.featuresConfig });
        
        for (const [id, module] of Object.entries(this.features)) {
            const isFeatureEnabled = this.globalEnabled && this.featuresConfig[id] !== false; // Default true if not specified

            if (isFeatureEnabled) {
                if (!module.isRunning) {
                    console.log(`GHN Helper Pro: Starting feature [${id}]`);
                    try {
                        module.start();
                        module.isRunning = true;
                    } catch (e) {
                        console.error(`GHN Helper Pro: Error starting feature [${id}]`, e);
                    }
                }
            } else {
                if (module.isRunning) {
                    console.log(`GHN Helper Pro: Stopping feature [${id}]`);
                    try {
                        module.stop();
                        module.isRunning = false;
                    } catch (e) {
                        console.error(`GHN Helper Pro: Error stopping feature [${id}]`, e);
                    }
                }
            }
        }
    }
}

// Export a singleton instance (we will assign it to window.GHNConfigManager so features can be registered)
window.GHNConfigManager = new ConfigManager();
