module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["next/core-web-vitals"],
  rules: {
    "no-console": process.env.PRE_COMMIT ? ["error", { allow: ["warn", "error"] }] : "off",
    "no-debugger": process.env.PRE_COMMIT ? "error" : "off",
  },
  ignorePatterns: ["sanity/*"],
};
