const db = require('./db.js')
const inquirer = require('inquirer')

function askForCreateTask(list) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: "Please enter a task title"
  }).then(answers4 => {
    list.push({
      title: answers4.title,
      done: false
    })
    db.write(list).then(() => { console.log('创建成功') }, () => { console.log('创建失败') })
  });
}

function markAsDone(list, index) {
  list[index].done = true
  db.write(list)
}

function markAsUnDone(list, index) {
  list[index].done = false
  db.write(list)
}

function updateTitle(list, index) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: "New title",
    default: list[index].title
  }).then(answers3 => {
    list[index].title = answers3.title
    db.write(list).then(() => { console.log('修改成功') }, () => { console.log('修改失败') })
  });
}

function remove(list, index) {
  list.splice(index, 1)
  db.write(list).then(() => { console.log('删除成功') }, () => { console.log('删除失败') })
}

function askForAction(list, index) {
  const actions = { markAsDone, markAsUnDone, updateTitle, remove }
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
    const action = actions[answers2.action]
    action && action(list, index)
  })
}

function printTasks(list) {
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
        askForAction(list, index)
      } else if (index === -2) {
        askForCreateTask(list)
      }
    });
}

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
    printTasks(list)
  }
}