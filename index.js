const Evernote = require('./evernote');

// Dev token url: https://sandbox.evernote.com/api/DeveloperToken.action
const devToken = 'S=s1:U=953e8:E=1713699c2c8:C=169dee893d0:P=1cd:A=en-devtoken:V=2:H=150be53b2b29620fe2d360d93c81df54';

async function main() {
  try {
    // Get client
    const authenticatedClient = await Evernote.getEvernoteClient(devToken);

    // Get note store and get notebooks
    const noteStore = await Evernote.getNoteStore(authenticatedClient);
    const notebooks = await noteStore.listNotebooks();

    // Select a notebook
    const selectedNote = notebooks.filter(curr => curr.name === 'GistNoteIt')[0];

    // Make a new note
    await Evernote.makeNote(noteStore, 'Test Title', 'Test content', selectedNote);
  } catch (error) {
    console.log(`\x1b[31mError caught\x1b[0m: ${JSON.stringify(error)}`);
    console.trace(error);
  }
}

main();
