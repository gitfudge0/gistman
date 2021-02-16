/**
 * Nested Inquirer call
 */

'use strict';
var inquirer = require('inquirer');

inquirer
  .prompt({
    type: 'list',
    name: 'chocolate',
    message: "What's your favorite chocolate?",
    choices: ['Mars', 'Oh Henry', 'Hershey'],
  })
  .then((ans) => {
    console.log(ans)
    return inquirer.prompt({
      type: 'list',
      name: 'beverage',
      message: 'And your favorite beverage?',
      choices: ['Pepsi', 'Coke', '7up', 'Mountain Dew', 'Red Bull'],
    });
  })
  .then((ans) => {
    console.log(JSON.stringify(ans))
  });