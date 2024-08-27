/**
 * Promise并发池，当有大量promise并发时，可以通过这个来限制并发数量
 * @param taskList 任务列表
 * @param limit 并发数
 * @param oneFinishCallback 每个完成的回调，参数是当前完成的个数和执行结果，可以用来制作进度条
 * @retrun 返回每个promise的结果，顺序和任务列表相同。 目前是成功和失败都会放入该结果
 */
export const promisePool = (taskList, limit, oneFinishCallback) => {
  return new Promise(async (resolve, reject) => {
    try {
      /*是否结束*/
      let isEnd = false;
      const length = taskList.length;
      /**当前并发池 */
      const pool = [];
      /**结果数组 */
      const res = new Array(length);
      /**完成的数量 */
      let count = 0;

      console.log('task start');
      for (let i = 0; i < length; i++) {
        if (isEnd) {
          resolve(res);
          break;
        }
        const task = taskList[i]();
        //promise结束的回调
        const handler = (info) => {
          pool.splice(pool.indexOf(task), 1); //任务执行完就删除
          res[i] = info; //不能使用res.push，否则不能保证结果顺序
          count++;

          try {
            oneFinishCallback(info, count, length); // 每个任务完成的回调，传入任务完成的执行结果
          } catch (e) {
            // 停止并发池
            // console.error(`bruteRes send error: ${e}`);
            isEnd = true;
          }

          if (count === length) {
            resolve(res);
          }
        };

        task.then(
          (data) => {
            handler(data);
            // console.log(`no ${i} res:`, data);
          },
          (err) => {
            handler(err);
            // console.log(`no ${i} failed, reson:`, err);
          }
        );

        pool.push(task);

        //如果到达了并发限制，就等到池子中任意一个结束
        if (pool.length >= limit) {
          await Promise.race(pool);
        }
      }
    } catch (error) {
      console.error('并发池出错', error);
      reject(error);
    }
  });
};
