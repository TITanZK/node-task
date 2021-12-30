const db = require('./db.js')

module.exports = {
  async add(title) {
    //  读取之前的任务
    const list = await db.read()
    //  向之前的里面添加一个 title 任务
    list.push({ title, done: false })
    //  存储任务文件
    await db.write(list)
  },
  async clear() {
    await db.write([])
  },
  async showAll() {
    const list = await db.read()
    list.map((item, index) => {
      console.log(`${item.done ? '[x]' : '[_]'} ${index + 1} - ${item.title}`)
    })
  }
}