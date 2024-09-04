const getLongTask = (longtask)=>{
  const entryHandler = list => {
  for (const long of list.getEntries()) {
    // 获取长任务详情
    console.log(long);
    longtask.push(long)
  }
};

let observer = new PerformanceObserver(entryHandler);
observer.observe({ entryTypes: ["longtask"] });
}
