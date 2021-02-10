const printer = require('./lib/printer');
const github = require('./lib/github');

async function main() {
  printer.printIntroductions();
  
  try {
    await github.initUser();
    await github.doUserAction();
  } catch (error) {
    printer.printError(error);
  }
}

main();