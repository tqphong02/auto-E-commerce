# Playwright POM scaffold

This project is a minimal scaffold for Playwright Test using the Page Object Model (POM).

Quick start:

```bash
cd d:\monhoc\Playwright\auto-ecomere
npm install
npx playwright install
npm test
```

What was created:

- `package.json` - script to run `npx playwright test`
- `playwright.config.js` - basic Playwright Test config
- `pages/` - Page Object classes (example: `HomePage.js`)
- `selectors/` - selector definitions used by page objects (example: `homeSelectors.js`)
- `tests/` - test specs using the page objects (`example.spec.js`)
- `.gitignore`

Next steps:

- Customize page objects in `pages/` and add more tests in `tests/`.
- Add fixtures or helpers into `fixtures/` and `utils/` as needed.
