const Evernote = require('evernote');

/**
 * @name getEvernoteClient
 * @description Get an instance of Evernote Client
 * @param {String} token Token to get authenticated client
 * @returns Evernote client
 */
function getEvernoteClient(token) {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        token,
        sandbox: true,
        china: false,
      };
      const client = await new Evernote.Client(options);
      resolve(client);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * @name getEvernoteAccessToken
 * @description Get the token details required to get an instance of an authenticated client
 * @param {*} client Evernote client to get acces token
 * @returns token and secret
 */
function getEvernoteAccessToken(client) {
  return new Promise(async (resolve, reject) => {
    try {
    // Having callback url makes no sense
    // TODO: Figure out a way to remove the need for callback url
      await client.getRequestToken('http://whyeven', (error, oauthToken, oauthTokenSecret) => {
        if (error) {
          reject(error);
        }
        console.log({ oauthToken, oauthTokenSecret });
        resolve({ oauthToken, oauthTokenSecret });
      });
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * @name getNoteStore
 * @description Get an instance of the note store
 * @param {*} client - Authenticated client
 * @returns note store
 */
function getNoteStore(client) {
  return new Promise(async (resolve, reject) => {
    try {
      const noteStore = await client.getNoteStore();
      resolve(noteStore);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * @name getUserStore
 * @des
 * @param {*} client
 * @returns
 */
function getUserStore(client) {
  return new Promise(async (resolve, reject) => {
    try {
      const userStore = await client.getUserStore();
      resolve(userStore);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * @name makeNote
 * @description Makes a new note on the selected notebook
 * @param {NoteStore} noteStore - Instance of note store
 * @param {string} noteTitle - Title of the note
 * @param {string} noteBody - Content of the note
 * @param {Notebook} parentNotebook - Notebook in which note is created
 * @returns
 */
function makeNote(noteStore, noteTitle, noteBody, parentNotebook) {
  return new Promise(async (resolve, reject) => {
    try {
      const Note = Evernote.Types.Note();
      Note.title = noteTitle;

      const body = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">\n<en-note>${noteBody}</en-note>`;
      Note.content = body;

      if (parentNotebook && parentNotebook.guid) {
        Note.notebookGuid = parentNotebook.guid;
      }

      const createdNote = await noteStore.createNote(Note);
      resolve(createdNote);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  getEvernoteClient,
  getEvernoteAccessToken,
  getNoteStore,
  getUserStore,
  makeNote,
};
