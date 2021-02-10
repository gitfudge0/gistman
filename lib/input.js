const inquirer = require('inquirer');
const CONSTANTS = require('./constants');

module.exports = {
  askUserToken: () => inquirer.prompt({
    name: 'accessToken',
    type: 'input',
    message: 'Enter your Github access token:',
    validate: function( value ) {
      if (value.length) {
        return true;
      } else {
        return 'Please enter your Github access token.';
      }
    }
  }),
  askUserAction: () => inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What do you want to do?',
    choices: [
      CONSTANTS.USER_ACTIONS.LIST_ALL_GISTS,
      CONSTANTS.USER_ACTIONS.CREATE_GIST,
      CONSTANTS.USER_ACTIONS.UPDATE_GIST,
      CONSTANTS.USER_ACTIONS.DELETE_GIST,
      CONSTANTS.USER_ACTIONS.EXIT,
    ],
  }),
};
