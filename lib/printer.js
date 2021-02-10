const pkg = require('../package.json');
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');

module.exports = {
  // Clear console
  clearConsole: clear,

  // Show introductory messages
  printIntroductions: () => {
    clear();
    console.log(
      chalk.yellow(
        figlet.textSync('gistman', {
          horizontalLayout: 'fitted',
        }),
      ),
    );
    console.log(chalk.cyan('\nversion: ') + pkg.version + '\n');
  },

  // Common printers
  printBold: (message, color = 'white') => console.log(chalk[color].bold(message)),

  printList: (list) => {
    let listString = '';
    list.forEach((listItem, index) => {
      listString += `${index + 1}. ${listItem}\n`;
    });

    console.log(`\n${listString}`);
  },

  // Print errors
  printError: (error) => {
    console.log(chalk.red(error));
  }
};
