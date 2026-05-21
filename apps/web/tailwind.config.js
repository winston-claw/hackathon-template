/** Web-only Tailwind config — adds `important: 'html'` for Next.js specificity. */
const baseConfig = require('../../packages/ui/tailwind.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  important: 'html',
};
