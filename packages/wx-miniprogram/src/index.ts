import { InitOptions } from 'frontend-monitor-types';
import { isWxMiniEnv } from 'frontend-monitor-utils';
import { setupReplace } from './load';
import { initOptions, log } from 'frontend-monitor-core';
import { sendTrackData, track } from './initiative';
import { SDK_NAME, SDK_VERSION } from 'frontend-monitor-shared';
import { MonitorVue } from 'frontend-monitor-vue';
import { errorBoundaryReport } from 'frontend-monitor-react';

export function init(options: InitOptions = {}) {
  if (!isWxMiniEnv) return;
  initOptions(options);
  setupReplace();
  Object.assign(wx, { monitorLog: log, SDK_NAME, SDK_VERSION });
}
export { log, sendTrackData, track, MonitorVue, errorBoundaryReport };
