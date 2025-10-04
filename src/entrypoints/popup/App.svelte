<script lang="ts">
  import { onMount } from 'svelte';

  // --- Types ---
  export interface Rule {
    id: string;
    type: 'block' | 'redirect';
    from: string;
    to?: string;
  }

  // --- State ---
  let rules: Rule[] = [];
  let newRuleType: 'block' | 'redirect' = 'block';
  let newRuleFrom: string = '';
  let newRuleTo: string = '';

  // --- Lifecycle ---
  onMount(async () => {
    // Clear old storage format
    await browser.storage.local.remove('blockedUrls');

    const storage = await browser.storage.local.get('rules');
    rules = storage.rules ?? [];

    browser.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes.rules) {
        rules = changes.rules.newValue ?? [];
      }
    });
  });

  // --- Helpers ---
  const storeRules = async () => {
    await browser.storage.local.set({ rules });
  };

  // --- Handlers ---
  const addRule = () => {
    if (!newRuleFrom) return;
    if (newRuleType === 'redirect' && !newRuleTo) return;

    const newRule: Rule = {
      id: self.crypto.randomUUID(),
      type: newRuleType,
      from: newRuleFrom,
      to: newRuleType === 'redirect' ? newRuleTo : undefined,
    };

    rules = [...rules, newRule];
    storeRules();

    // Reset form
    newRuleType = 'block';
    newRuleFrom = '';
    newRuleTo = '';
  };

  const removeRule = (id: string) => {
    rules = rules.filter(rule => rule.id !== id);
    storeRules();
  };
</script>

<main>
  <h1>Request Rules</h1>
  <p>Use <a href="https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns" target="_blank" rel="noopener noreferrer">match patterns</a> for URLs.</p>

  <form on:submit|preventDefault={addRule}>
    <div class="form-grid">
      <label for="type">Type</label>
      <select id="type" bind:value={newRuleType}>
        <option value="block">Block</option>
        <option value="redirect">Redirect</option>
      </select>

      <label for="from">From</label>
      <input id="from" type="text" bind:value={newRuleFrom} placeholder="*://*.example.com/*" />

      {#if newRuleType === 'redirect'}
        <label for="to">To</label>
        <input id="to" type="text" bind:value={newRuleTo} placeholder="http://localhost:8080/*" />
      {/if}
    </div>
    <button type="submit">Add Rule</button>
  </form>

  <hr />

  <h2>Active Rules</h2>
  <ul class="rules-list">
    {#if rules.length === 0}
      <p>No rules defined yet.</p>
    {/if}
    {#each rules as rule (rule.id)}
      <li>
        <div class="rule-details">
          <strong class="type">{rule.type}</strong>
          <span class="pattern">{rule.from}</span>
          {#if rule.type === 'redirect'}
            <span class="arrow">→</span>
            <span class="pattern">{rule.to}</span>
          {/if}
        </div>
        <button class="remove-btn" on:click={() => removeRule(rule.id)}>Remove</button>
      </li>
    {/each}
  </ul>
</main>

<style>
  main {
    padding: 1em;
    font-family: sans-serif;
    max-width: 500px;
    margin: 0 auto;
  }
  form {
    margin-bottom: 1.5em;
  }
  .form-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.75em;
    align-items: center;
    margin-bottom: 1em;
  }
  label {
    font-weight: bold;
  }
  input, select {
    padding: 0.5em;
    width: 100%;
    box-sizing: border-box;
  }
  button[type="submit"] {
    width: 100%;
    padding: 0.75em;
    font-weight: bold;
  }
  hr {
    border: none;
    border-top: 1px solid #eee;
    margin: 1.5em 0;
  }
  .rules-list {
    list-style: none;
    padding: 0;
  }
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75em;
    border-bottom: 1px solid #eee;
    gap: 1em;
  }
  .rule-details {
    display: flex;
    align-items: center;
    gap: 0.5em;
    flex-wrap: wrap;
    word-break: break-all;
  }
  .type {
    background-color: #eee;
    padding: 0.2em 0.5em;
    border-radius: 4px;
    font-size: 0.9em;
  }
  .arrow {
    font-weight: bold;
  }
  .remove-btn {
    background: #f44336;
    color: white;
    border: none;
    padding: 0.5em 0.75em;
    border-radius: 4px;
    cursor: pointer;
  }
  .remove-btn:hover {
    background: #d32f2f;
  }
</style>
