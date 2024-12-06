export * from './plugin/handleEvents';
export * from './plugin/load';
export * from './plugin/replace';

import { log } from 'frontend-monitor-core';
import { _global } from 'frontend-monitor-utils';
import { SDK_VERSION, SDK_NAME } from 'frontend-monitor-shared';
import { init } from './core/init';




export { SDK_VERSION, SDK_NAME, init, log };
