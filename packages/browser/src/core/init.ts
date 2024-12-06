import { initOptions, log } from 'frontend-monitor-core';
import { _global } from 'frontend-monitor-utils';
import { SDK_VERSION, SDK_NAME } from 'frontend-monitor-shared';
import { InitOptions } from 'frontend-monitor-types';
import { setupReplace } from '../plugin/load';
function webInit(options: InitOptions = {}): void {
  if (!('XMLHttpRequest' in _global) || options.disabled) return;
  initOptions(options);
  setupReplace();
}

function init(options: InitOptions = {}): void {
  webInit(options);
}

export { SDK_VERSION, SDK_NAME, init, log };
