import { Config } from './models';

let config: Config = {
  dom: {},
  defaultImports: [],
  zoneless: false,
};

export function configure(newConfig: Partial<Config> | ((config: Partial<Config>) => Partial<Config>)) {
  if (typeof newConfig === 'function') {
    newConfig = newConfig(config);
  }

  config = {
    ...config,
    ...newConfig,
  };
}

export function getConfig() {
  return config;
}
