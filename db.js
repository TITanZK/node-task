const fs = require('fs');
const homedir = process.env.HOME || require('os').homedir();// 获取用户 home 目录
const path = require('path')
const dbPath = path.join(homedir, '.todo')

const db = {
  read(path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, { flag: 'a+' }, (error, data) => {
        if (error) return reject
        let list
        try {
          list = JSON.parse(data.toString())
        } catch (error) {
          list = []
        }
        resolve(list)
      })
    })
  },
  write(list, path = dbPath) {
    const todoString = JSON.stringify(list)
    return new Promise((resolve, reject) => {
      fs.writeFile(path, todoString, error => {
        if (error) reject(error)
        resolve()
      })
    })
  }
}

module.exports = db