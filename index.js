const db = require('./db.js')
const inquirer = require('inquirer')

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
    const choicesArray = list.map((item, index) => {
      return {
        name: `${item.done ? '[x]' : '[_]'} ${index + 1} - ${item.title}`,
        value: index.toString()
      }
    })
    inquirer
      .prompt({
        type: 'list',
        name: 'index',
        message: 'Please select the task that will be operated!',
        choices: [{ name: 'quit', value: '-1' }, ...choicesArray, { name: '+ create a task', value: '-2' }]
      })
      .then((answers) => {
        console.log(answers);
      });
  }
}