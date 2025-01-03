import tseslint from "typescript-eslint";
import rootConfig from "../../eslint.config.mjs";

const rootConfig = require('../../eslint.config.js');

module.exports = tseslint.config(
  ...rootConfig,
);