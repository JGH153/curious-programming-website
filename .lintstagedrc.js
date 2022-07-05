// This file is required by next for linting
// https://nextjs.org/docs/basic-features/eslint
const path = require("path");

const buildEslintCommand = (filenames) =>
  `npm run lint-strict -- --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(" --file ")}`;

module.exports = {
  "*.{js,jsx,ts,tsx}": ["npm run prettier-fix", buildEslintCommand],
};
