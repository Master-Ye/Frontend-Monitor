Vue.use(frontendMonitor.MonitorVue);
frontendMonitor.init({
  debug: true,
  silentConsole: true,
  maxBreadcrumbs: 10,
  dsn: 'http://localhost:2021/errors/upload',
});
