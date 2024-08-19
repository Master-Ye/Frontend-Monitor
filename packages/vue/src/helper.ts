import {
  getBigVersion,
  getLocationHref,
  getTimestamp,
  variableTypeDetection,
  Severity,
} from 'frontend-monitor-utils';
import { ErrorTypes, BreadCrumbTypes } from 'frontend-monitor-shared';
import { ViewModel, VueInstance } from './types';
import { breadcrumb, transportData } from 'frontend-monitor-core';
import { ReportDataType } from 'frontend-monitor-types';

export function handleVueError(
  err: Error,
  vm: ViewModel,
  info: string,
  level: Severity,
  breadcrumbLevel: Severity,
  Vue: VueInstance,
): void {
  const version = Vue?.version;
  let data: ReportDataType = {
    type: ErrorTypes.VUE_ERROR,
    message: `${err.message}(${info})`,
    level,
    url: getLocationHref(),
    name: err.name,
    stack: err.stack || [],
    time: getTimestamp(),
  };
  if (variableTypeDetection.isString(version)) {
    switch (getBigVersion(version)) {
      case 2:
        data = { ...data, ...vue2VmHandler(vm) };
        break;
      case 3:
        data = { ...data, ...vue3VmHandler(vm) };
        break;
      default:
        return;
        break;
    }
  }
  breadcrumb.push({
    type: BreadCrumbTypes.VUE,
    category: breadcrumb.getCategory(BreadCrumbTypes.VUE),
    data,
    level: breadcrumbLevel,
  });
  transportData.send(data);
}
function vue2VmHandler(vm: ViewModel) {
  let componentName = '';
  if (vm.$root === vm) {
    componentName = 'root';
  } else {
    const name = vm._isVue
      ? (vm.$options && vm.$options.name) || (vm.$options && vm.$options._componentTag)
      : vm.name;
    componentName =
      (name ? 'component <' + name + '>' : 'anonymous component') +
      (vm._isVue && vm.$options && vm.$options.__file
        ? ' at ' + (vm.$options && vm.$options.__file)
        : '');
  }
  return {
    componentName,
    propsData: vm.$options && vm.$options.propsData,
  };
}
function vue3VmHandler(vm: ViewModel) {
  let componentName = '';
  if (vm.$root === vm) {
    componentName = 'root';
  } else {
    console.log(vm.$options);
    const name = vm.$options && vm.$options.name;
    componentName = name ? 'component <' + name + '>' : 'anonymous component';
  }
  return {
    componentName,
    propsData: vm.$props,
  };
}
