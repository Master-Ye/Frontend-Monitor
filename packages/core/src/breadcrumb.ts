import { BreadCrumbTypes, BreadCrumbCategory } from 'frontend-monitor-shared';
import {
  logger,
  validateOption,
  getTimestamp,
  silentConsoleScope,
  _support,
} from 'frontend-monitor-utils';
import { BreadcrumbPushData, InitOptions } from 'frontend-monitor-types';
import { transportData } from './transportData';

export class Breadcrumb {
  maxBreadcrumbs = 10;
  beforePushBreadcrumb: unknown = null;
  errStack: BreadcrumbPushData[] = [];
  stack: BreadcrumbPushData[] = [];
  constructor() { }

  push(data: BreadcrumbPushData): void {
    if (typeof this.beforePushBreadcrumb === 'function') {
      let result: BreadcrumbPushData = null;
      const beforePushBreadcrumb = this.beforePushBreadcrumb;
      silentConsoleScope(() => {
        result = beforePushBreadcrumb(this, data);
      });
      if (!result) return;
      this.immediatePush(result);
      return;
    }
    this.immediatePush(data);
  }
  immediatePush(data: BreadcrumbPushData): void {
    data.time || (data.time = getTimestamp());
    if (this.errStack.length >= this.maxBreadcrumbs) {
      this.shift();
    }
    if (this.stack.length >= this.maxBreadcrumbs) {
      transportData.send({
        data: this.stack,
        type: 'Stack'
      }
      )
      this.clear()
    }
    this.errStack.push(data)
    this.stack.push(data);
    this.stack.sort((a, b) => a.time - b.time);
    this.errStack.sort((a, b) => a.time - b.time);
    logger.log(this.stack);
  }
  shift(): boolean {
    return this.errStack.shift() !== undefined;
  }
  clear(): void {
    this.stack = [];
  }
  getStack(): BreadcrumbPushData[] {
    return this.errStack;
  }
  getCategory(type: BreadCrumbTypes) {
    switch (type) {
      case BreadCrumbTypes.XHR:
      case BreadCrumbTypes.FETCH:
        return BreadCrumbCategory.HTTP;
      case BreadCrumbTypes.CLICK:
      case BreadCrumbTypes.ROUTE:
      case BreadCrumbTypes.TAP:
      case BreadCrumbTypes.TOUCHMOVE:
        return BreadCrumbCategory.USER;
      case BreadCrumbTypes.CUSTOMER:
      case BreadCrumbTypes.CONSOLE:
        return BreadCrumbCategory.DEBUG;
      case BreadCrumbTypes.APP_ON_LAUNCH:
      case BreadCrumbTypes.APP_ON_SHOW:
      case BreadCrumbTypes.APP_ON_HIDE:
      case BreadCrumbTypes.PAGE_ON_SHOW:
      case BreadCrumbTypes.PAGE_ON_HIDE:
      case BreadCrumbTypes.PAGE_ON_SHARE_APP_MESSAGE:
      case BreadCrumbTypes.PAGE_ON_SHARE_TIMELINE:
      case BreadCrumbTypes.PAGE_ON_TAB_ITEM_TAP:
        return BreadCrumbCategory.LIFECYCLE;
      case BreadCrumbTypes.UNHANDLEDREJECTION:
      case BreadCrumbTypes.CODE_ERROR:
      case BreadCrumbTypes.RESOURCE:
      case BreadCrumbTypes.VUE:
      case BreadCrumbTypes.REACT:
      default:
        return BreadCrumbCategory.EXCEPTION;
    }
  }
  bindOptions(options: InitOptions = {}): void {
    const { maxBreadcrumbs, beforePushBreadcrumb } = options;
    validateOption(maxBreadcrumbs, 'maxBreadcrumbs', 'number') &&
      (this.maxBreadcrumbs = maxBreadcrumbs);
    validateOption(beforePushBreadcrumb, 'beforePushBreadcrumb', 'function') &&
      (this.beforePushBreadcrumb = beforePushBreadcrumb);
  }
}
const breadcrumb = _support.breadcrumb || (_support.breadcrumb = new Breadcrumb());
export { breadcrumb };
