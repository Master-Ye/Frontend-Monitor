import { IAnyObject } from 'frontend-monitor-types';

export interface MiniRoute {
  from: string;
  to: string;
  isFail?: boolean;
  message?: string;
}

export interface WxOnShareAppMessageBreadcrumb {
  path: string;
  query: IAnyObject;
  options: WechatMiniprogram.Page.IShareAppMessageOption;
}

export interface WxOnTabItemTapBreadcrumb {
  path: string;
  query: IAnyObject;
  options: WechatMiniprogram.Page.ITabItemTapOption;
}

export interface WxRequestErrorBreadcrumb {
  requestOptions: WechatMiniprogram.RequestOption;
  errMsg: string;
}

export interface WxLifeCycleBreadcrumb {
  path: string;
  query: IAnyObject;
}
