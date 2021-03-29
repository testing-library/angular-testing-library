import { Config } from './models';

let config: Config = {
  dom: {},
  defaultImports: [],
};

export function configure(newConfig: Partial<Config> | ((config: Partial<Config>) => Partial<Config>)) {
  if (typeof newConfig === 'function') {
    // Pass the existing config out to the provided function
    // and accept a delta in return
    newConfig = newConfig(config);
  }

  // Merge the incoming config delta
  config = {
    ...config,
    ...newConfig,
  };
}

export function getConfig() {
  return config;
}
