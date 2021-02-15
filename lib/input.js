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
  askFileInputMethod: () => inquirer.prompt({
    name: 'inputMethod',
    type: 'list',
    choices: [
      CONSTANTS.FILE_METADATA.INPUT_METHOD.EDITOR,
      CONSTANTS.FILE_METADATA.INPUT_METHOD.LOCATION,
    ],
  }),
  askNewFileContent: () => inquirer.prompt([
    {
      name: 'fileContent',
      type: 'editor',
      message: 'Enter the contents of the gist',
    },
    {
      name: 'filename',
      type: 'input',
      message: 'Enter the file name (with extension, if any)',
      validate: function(value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter a file name.';
        }
      }
    }
  ]),
  askFileLocation: () => inquirer.prompt({
    name: 'fileLocation',
    type: 'input',
    message: 'Enter full file location with file and extension.',
  }),
  askFileMetadata: () => inquirer.prompt([
    {
      name: 'description',
      type: 'input',
      message: 'Enter description',
    },
    {
      name: 'isPublic',
      type: 'list',
      message: 'Visibility',
      choices: [
        CONSTANTS.FILE_METADATA.VISIBILITY.PRIVATE,
        CONSTANTS.FILE_METADATA.VISIBILITY.PUBLIC,
      ],
    }
  ]),
  askGistToDelete: (gists) => inquirer.prompt([
    {
      name: 'deleteOption',
      type: 'list',
      loop: false,
      message: 'Select the gist you want to delete',
      choices: gists.map((curr, index) => ({
        name: `${index + 1}) ${curr.files}`,
        value: curr.id,
      })),
    },
    {
      name: 'confirm',
      type: 'list',
      message: 'Are you sure you want to delete the gist?',
      choices: [
        { name: 'No, cancel', value: false },
        { name: 'Yes', value: true },
      ],
    },
  ]),
};
