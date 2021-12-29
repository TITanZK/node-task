const program = require('commander');

const api = require('./index.js')

program
  .option('-d, --debug', 'output extra debugging')

program
  .command('add')
  .description('add a task')
  .action((...source) => {
    const words = source.slice(0, -1).join(' ')
    api.add(words)
  });
program
  .command('clear')
  .description('clear a task')
  .action((...source) => {
    const words = source.slice(0, -1).join(' ')
    console.log(words);
  });

program.parse(process.argv);