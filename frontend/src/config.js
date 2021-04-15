// list of stock analysis apps
// also their paths
export const stockAppList = ['info', 'compare', 'recommendation', 'events'];

// name of each stock analysis app
export const stockAppNameMap = {
  info: '基本面',
  compare: '同行比较',
  // 'business-analysis': '经营分析',
  recommendation: '头条文章',
  events: '重点事件',
};

export const isDev = process.env.NODE_ENV === 'development';

export const serverConfig = {
  baseUrl: isDev
    ? `http://${window.location.host.replace(':3000', ':8000')}`
    : `http://${window.location.host}`,
};
