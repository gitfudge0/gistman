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

    // await Evernote.makeNote(noteStore, 'Test Title', 'Test content', selectedNote);
    // await Evernote.makeNotebook(noteStore, 'Test Notebook')
    // const notes = await Evernote.listNotes(noteStore, 'e9ec770a-3191-4b6a-b7d9-14f3ddbc0c20');
    const noteContent = await Evernote.getNoteContent(noteStore, '4a963d3c-a0c7-46cc-8771-fff7dacbcf98');
    console.log(noteContent);
  } catch (error) {
    console.log(`\x1b[31mError caught\x1b[0m: ${JSON.stringify(error)}`);
    console.trace(error);
  }
}

main();
