const printer = require('./lib/printer');
const github = require('./lib/github');
const CONSTANTS = require('./lib/constants');

async function main() {
  let userAction;
  printer.printIntroductions();
  
  try {
    await github.initUser();

    do {
      userAction = await github.doUserAction();
    } while (userAction !== CONSTANTS.USER_ACTIONS.EXIT);
  } catch (error) {
    printer.printError(error);
  }
}

main();