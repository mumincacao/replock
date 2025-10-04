# Project: replock

This is a browser extension named "replock".

## Overview

This extension provides a rule-based system to intercept and modify web requests. Users can define rules to either block requests or redirect them to a different URL, which is useful for tasks like redirecting API calls to a local development environment.

## Features

- **Rule-Based Control:** Create, manage, and delete rules for handling web requests.
- **Two Rule Types:**
  - **Block:** Prevents the request from being sent.
  - **Redirect:** Changes the destination of the request to a new URL.
- **Dynamic URL Matching:** Use match patterns with wildcards (`*`) to define flexible rules (e.g., `https://example.com/api/*`).
- **Real-time Updates:** Rule changes from the popup UI are applied instantly.

## Tech Stack

- **Framework:** [WXT (Web Extension for TypeScript)](https://wxt.dev/)
- **UI:** [Svelte](https://svelte.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

## Project Structure

- **`src/`**: The main source code directory.
  - **`entrypoints/`**: Contains the main entry points for the extension.
    - `background.ts`: Handles background tasks, processing the request modification rules.
    - `content.ts`: Scripts injected into web pages.
    - `popup/`: The UI code for the extension's popup, built with Svelte.
- **`wxt.config.ts`**: The configuration file for the WXT framework.
- **`package.json`**: Defines project metadata and dependencies.

## Development Scripts

- **`npm run dev`**: Starts the development server for live-reloading.
- **`npm run build`**: Builds the extension for production.
- **`npm run zip`**: Packages the built extension into a zip file for distribution.
- **`npm run check`**: Runs the Svelte type checker.

## Permissions

The extension requires the following permissions:
- `webRequest`: To monitor network requests.
- `webRequestBlocking`: To block or modify requests.
- `<all_urls>`: To operate on all websites.
- `storage`: To store the user-defined rules.
