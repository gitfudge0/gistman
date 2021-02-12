const fs = require('fs');
const Configstore = require('configstore');
const { Octokit } = require('@octokit/rest');
const { Spinner } = require('clui');

const input = require('./input');
const pkg = require('../package.json');
const CONSTANTS = require('./constants');
const printer = require('./printer');

let git;
const conf = new Configstore(pkg.name);

module.exports = {
  initUser: () => new Promise(async (resolve, reject) => {
    try {
      let token = conf.get('github.token');

      if (!token) {
        ({ accessToken: token } = await input.askUserToken());
        conf.set({ 'github.token': token });
      }
      const status = new Spinner('Authenticating you, please wait...');
        
      status.start();
      git = new Octokit({
        auth: token,
        userAgent: `${pkg.name} ${pkg.version}`,
      });
      status.stop();
      resolve();
    } catch (error) {
      reject(error);
    }
  }),
  doUserAction: () => new Promise(async (resolve, reject) => {
    const status = new Spinner('Please wait...');

    try {
      const { action } = await input.askUserAction();
      
      status.start();

      switch (action) {
        case CONSTANTS.USER_ACTIONS.LIST_ALL_GISTS:
          status.message('Fetching your gists...');
          const { data: gists } = await git.gists.list();

          status.stop();
          
          printer.printList(gists.map(curr => {
            const fileKeys = Object.keys(curr.files);
            if (curr.description.length > 0) {
              return `${fileKeys[0]} | ${curr.description}`;
            }
            return fileKeys[0];
          }));
          break;
        case CONSTANTS.USER_ACTIONS.CREATE_GIST:
          status.stop();

          let filename;
          let fileContent;
          let fileLocation;

          const { inputMethod } = await input.askFileInputMethod();

          if (inputMethod === CONSTANTS.FILE_METADATA.INPUT_METHOD.EDITOR) {
            ({ fileContent, filename } = await input.askNewFileContent());
          } else {
            ({ fileLocation } = await input.askFileLocation());
            fileContent = await fs.readFileSync(fileLocation, { encoding: 'utf-8' });
            filename = fileLocation.replace(/^.*[\\\/]/, '');
          }

          const fileMetadata = await input.askFileMetadata(filename);
          
          status.start();
          status.message('Creating new gist. Please wait...');
          
          const { data } = await git.gists.create({
            files: {
              [filename]: {
                content: fileContent,
              },
            },
            description: fileMetadata.description,
            public: fileMetadata.isPublic === CONSTANTS.FILE_METADATA.VISIBILITY.PUBLIC,
          });
          status.stop();
          
          printer.printSuccessMessage(`\nGist ${filename} was created successfully!`);
          printer.printMessage('You can access it at');
          printer.printMessage(data.html_url, 'cyan');
          console.log('\n');
          break;
        case CONSTANTS.USER_ACTIONS.EXIT:
            status.message('Bye! :)');
            setTimeout(() => {
              status.stop();
            }, 500);
          break;
        case CONSTANTS.USER_ACTIONS.DELETE_GIST:
          break;
        default:
          // do something
          break;
      }

      resolve(action);
    } catch (error) {
      status.stop();
      reject(error);
    }
  }),
};
