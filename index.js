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
        const index = parseInt(answers.index)
        if (index >= 0) {
          inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'Please select your action',
            choices: [
              { name: '退出', value: 'quit' },
              { name: '已完成', value: 'markAsDone' },
              { name: '未完成', value: 'markAsUnDone' },
              { name: '修改标题', value: 'updateTitle' },
              { name: '删除', value: 'remove' }
            ]
          }).then(answers2 => {
            switch (answers2.action) {
              case 'markAsDone':
                list[index].done = true
                db.write(list)
                break;
              case 'markAsUnDone':
                list[index].done = false
                db.write(list)
                break;
              case 'updateTitle':
                inquirer.prompt({
                  type: 'input',
                  name: 'title',
                  message: "New title",
                  default: list[index].title
                }).then(answers3 => {
                  list[index].title = answers3.title
                  db.write(list)
                });
                break;
              case 'remove':
                list.splice(index, 1)
                db.write(list)
                break;
            }
          })
        } else if (index === -2) {
          inquirer.prompt({
            type: 'input',
            name: 'title',
            message: "Please enter a task title"
          }).then(answers4 => {
            list.push({
              title: answers4.title,
              done: false
            })
            db.write(list)
          });
        }
      });
  }
}