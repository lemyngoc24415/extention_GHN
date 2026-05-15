// content.js - Entry point for GHN Helper Pro extension

// Ensure config manager is initialized after all features are loaded
// In manifest.json, content.js is listed last in the "js" array.
if (window.GHNConfigManager) {
    console.log("GHN Helper Pro: Initializing Extension...");
    window.GHNConfigManager.init();
} else {
    console.error("GHN Helper Pro: ConfigManager not found!");
}