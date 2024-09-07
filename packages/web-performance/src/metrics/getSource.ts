function getResource() {
  if (performance.getEntriesByType) {
    const entries = performance.getEntriesByType('resource');
    // 过滤掉非静态资源的 fetch、 xmlhttprequest、beacon
    let list = entries.filter((entry) => {
      return ['fetch', 'xmlhttprequest', 'beacon'].indexOf(entry.initiatorType) === -1;
    });

    if (list.length) {
      list = JSON.parse(JSON.stringify(list));
      list.forEach((entry) => {
        entry.isCache = isCache(entry);
      });
    }
    return list;
  }
}

// 判断资料是否来自缓存
// transferSize为0，说明是从缓存中直接读取的（强制缓存）
// transferSize不为0，但是`encodedBodySize` 字段为 0，说明它走的是协商缓存（`encodedBodySize 表示请求响应数据 body 的大小`）
function isCache(entry) {
  return entry.transferSize === 0 || (entry.transferSize !== 0 && entry.encodedBodySize === 0);
}
