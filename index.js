const Evernote = require('./evernote');

async function main() {
  const evernoteClient = await Evernote.getEvernoteClient();
  const token = await Evernote.getEvernoteAccessToken(evernoteClient);

  // Get client with token
  const authenticatedClient = await Evernote.getEvernoteClient(token.oauthToken);

  // Get note store
  const noteStore = await Evernote.getNoteStore(authenticatedClient);
  console.log({ noteStore });
}

main();
