import type { Rule } from './popup/App.svelte';

let rules: Rule[] = [];

// Function to convert a match pattern to a regex
const patternToRegex = (pattern: string): RegExp => {
  const escaped = pattern.replace(/[.+?^${}()|[\\]/g, '\\$&').replace(/\*/g, '.*');
  return new RegExp(`^${escaped}$`);
};

const handleRequest = (requestDetails: browser.webRequest.OnBeforeRequestDetails): browser.webRequest.BlockingResponse | undefined => {
  for (const rule of rules) {
    const regex = patternToRegex(rule.from);
    if (regex.test(requestDetails.url)) {
      if (rule.type === 'block') {
        console.log(`[replock] Blocking: ${requestDetails.url}`);
        return { cancel: true };
      }

      if (rule.type === 'redirect' && rule.to) {
        // Create a regex from the 'from' pattern to capture the wildcard part
        const fromRegex = new RegExp(rule.from.replace(/[.*+?^${}()|[\\]/g, '\\$&').replace(/\\\*/g, '(.*)'));
        const match = requestDetails.url.match(fromRegex);
        
        // If the 'to' pattern has a wildcard and we captured something, replace it.
        const redirectUrl = rule.to.includes('*') && match?.[1] != null ? rule.to.replace('*', match[1]) : rule.to;

        if (redirectUrl !== requestDetails.url) {
          console.log(`[replock] Redirecting: ${requestDetails.url} -> ${redirectUrl}`);
          return { redirectUrl };
        }
      }
    }
  }
  return undefined;
};

const setupListeners = () => {
  // Remove any existing listener to avoid duplicates
  browser.webRequest.onBeforeRequest.removeListener(handleRequest);

  if (rules.length > 0) {
    // Get all URL patterns to listen to
    const allUrls = rules.map(rule => rule.from);
    browser.webRequest.onBeforeRequest.addListener(
      handleRequest,
      { urls: allUrls },
      ['blocking']
    );
    console.log('[replock] Listeners updated with rules:', rules);
  } else {
    console.log('[replock] No rules to apply. Listeners are inactive.');
  }
};

export default defineBackground(async () => {
  console.log('[replock] Background script loaded.');
  
  // Load rules from storage on startup
  const storage = await browser.storage.local.get('rules');
  rules = storage.rules ?? [];
  setupListeners();

  // Listen for changes in storage and update rules accordingly
  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.rules) {
      rules = changes.rules.newValue ?? [];
      setupListeners();
    }
  });
});