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

      switch (action) {
        case CONSTANTS.USER_ACTIONS.LIST_ALL_GISTS: {
          status.start();
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
        }
        case CONSTANTS.USER_ACTIONS.CREATE_GIST: {
          const files = {};

          const { createCount } = await input.askGistCreateCount();

          do {
            let filename;
            let fileContent;
            let fileLocation;

            const { inputMethod } = await input.askFileInputMethod(Object.keys(files).length + 1);
  
            if (inputMethod === CONSTANTS.FILE_METADATA.INPUT_METHOD.EDITOR) {
              ({ fileContent, filename } = await input.askNewFileContent(Object.keys(files).length + 1));
            } else {
              ({ fileLocation } = await input.askFileLocation());
              fileContent = await fs.readFileSync(fileLocation, { encoding: 'utf-8' });
              filename = fileLocation.replace(/^.*[\\\/]/, '');
            }
  
            files[filename] = { content: fileContent };
          } while(Object.keys(files).length < createCount);
          
          const gistMetadata = await input.askFileMetadata();
          
          status.start();
          status.message('Creating new gist. Please wait...');
          
          const { data } = await git.gists.create({
            files,
            description: gistMetadata.description,
            public: gistMetadata.isPublic === CONSTANTS.FILE_METADATA.VISIBILITY.PUBLIC,
          });
          status.stop();
          
          printer.printSuccessMessage('\nGist was created successfully!');
          printer.printMessage('You can access it at');
          printer.printMessage(data.html_url, 'cyan');
          console.log('\n');
          break;
        }
        case CONSTANTS.USER_ACTIONS.EXIT: {
          status.start();
          status.message('Bye! :)');
          setTimeout(() => {
            status.stop();
          }, 500);
          break;
        }
        case CONSTANTS.USER_ACTIONS.DELETE_GIST: {
          status.start();
          status.message('Fetching your gists...');
          const { data } = await git.gists.list();
          status.stop();

          const gists = data.map(curr => ({
            id: curr.id,
            files: (function() {
              const fileValues = Object.values(curr.files).map(x => x.filename);
              if (fileValues.length > 2) {
                return `${fileValues.slice(0, 2).join(', ')}, and ${fileValues.length - 2} more`;
              }
              return fileValues[0];
            })(),
          }));
          const { deleteOption: gist_id, confirm } = await input.askGistToDelete(gists);

          if (confirm) {
            status.start();
            status.message(`Deleting ${gists.find(curr => curr.id === gist_id).files}. Please wait...`);

            await git.gists.delete({
              gist_id,
            });

            status.stop();
            printer.printSuccessMessage('\nGist was deleted succesfully!\n');
          }
          break;
        }
        case CONSTANTS.USER_ACTIONS.UPDATE_GIST: {
          status.start();
          status.message('Fetching your gists. Please wait...');
          const { data } = await git.gists.list();
          status.stop();

          const gists = data.map(curr => ({
            id: curr.id,
            files: (function() {
              const fileValues = Object.values(curr.files).map(x => ({
                filename: x.filename,
                rawUrl: x.raw_url,
              }));
              return fileValues;
            })(),
          }));

          const { selectedGist } = await input.selectGist(gists);

          status.start();
          status.message('Fetching gist content. Please wait...');
          const { data: gistData } = await git.gists.get({
            gist_id: selectedGist,
          });
          status.stop();

          const fileListWithNamesAndData = Object.entries(gistData.files).map(curr => ({
            name: curr[0],
            data: curr[1],
          }));

          const { fileToUpdate } = await input.selectFileToUpdate(fileListWithNamesAndData);
          const selectedFile = fileListWithNamesAndData.find(curr => curr.name === fileToUpdate);
          const { updatedFile, confirm } = await input.updateGist(selectedFile.data.content);

          if (!confirm) {
            break;
          }
          
          status.start();
          status.message(`Updating file ${selectedFile}`);
          const filesObj = {};
          fileListWithNamesAndData.forEach(item => {
            filesObj[item.name] = {
              filename: item.name,
              content: item.data.content,
            };
          })
          await git.gists.update({
            gist_id: selectedGist,
            files: {
              ...filesObj,
              [selectedFile.name]: {
                filename: selectedFile.name,
                content: updatedFile,
              }
            },
          });
          status.stop();

          printer.printSuccessMessage('\nGist was updated successfully!\n');

          break;
        }
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
