const Evernote = require('evernote');

const EVERNOTEAPP = {};

EVERNOTEAPP.getEvernoteClient = (token = null) => new Promise(async (resolve, reject) => {
  try {
    let client;
    if (token) {
      client = await new Evernote.Client({
        token,
      });
    } else {
      client = await new Evernote.Client({
        consumerKey: 'thediggu',
        consumerSecret: '3bd18451c6442d44',
        sandbox: true, // change to false when you are ready to switch to production
        china: false,
      });
    }

    resolve(client);
  } catch (err) {
    reject(err);
  }
});

EVERNOTEAPP.getEvernoteAccessToken = client => new Promise(async (resolve, reject) => {
  try {
    // Having callback url makes no sense
    // TODO: Figure out a way to remove the need for callback url
    await client.getRequestToken('http://whyeven', (error, oauthToken, oauthTokenSecret) => {
      if (error) {
        reject(error);
      }
      resolve({ oauthToken, oauthTokenSecret });
    });
  } catch (error) {
    reject(error);
  }
});

EVERNOTEAPP.getNoteStore = client => new Promise(async (resolve, reject) => {
  try {
    const noteStore = await client.getNoteStore();
    resolve(noteStore);
  } catch (error) {
    reject(error);
  }
});

module.exports = EVERNOTEAPP;
