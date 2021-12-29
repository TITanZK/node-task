const homedir = process.env.HOME || require('os').homedir();// 获取用户 home 目录
const fs = require('fs');
const path = require('path')
const dbPath = path.join(homedir, '.todo')

module.exports.add = (title) => {
  fs.readFile(dbPath, { flag: 'a+' }, (error, data) => {
    let list
    try {
      list = JSON.parse(data.toString())
    } catch (error) {
      list = []
    }
    const task = {
      title,
      done: false
    }
    list.push(task)
    const todoString = JSON.stringify(list)
    fs.writeFile(dbPath, todoString, error => {
      if (error) console.log(error)
    })
  })
}