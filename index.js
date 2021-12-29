const db = require('./db.js')

module.exports.add = async (title) => {
  //  读取之前的任务
  const list = await db.read()
  //  向之前的里面添加一个 title 任务
  list.push({ title, done: false })
  //  存储任务文件
  await db.write(list)
}