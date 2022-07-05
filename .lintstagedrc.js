// This file is the config for lint-staged and what is executed by the husky hook
const path = require("path");

const buildEslintCommand = (filenames) =>
  `npm run lint-strict -- --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(" --file ")}`;

module.exports = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand],
};
