// ===============================================================================
// LOAD DATA
// We are linking our routes to an index page and a notes data page.
// ===============================================================================
var fs = require(`fs`);
var path = require("path");


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  // API GET Requests
  // Below code handles when users visit a page.
  // In each of the below cases when a user visits a link
  // ---------------------------------------------------------------------------

  app.get(`/api/notes`, function(req, res) {
      // Reads notes from the json file
    let notesContent = fs.readFileSync(path.join(__dirname, `../db/db.json`), `utf-8`);
    // Sends as an object to browser
    return res.json(JSON.parse(notesContent));
  });

  // API POST Requests
  // Below code handles when a user submits a note and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // Then the server saves the data to the json array
  // ---------------------------------------------------------------------------

  // Send new note to the json file
  app.post(`/api/notes`, function(req, res) {
   
    // req.body is available since we're using the body parsing middleware
    
    let notesContent = fs.readFileSync(path.join(__dirname, `../db/db.json`), `utf-8`);

    // Parse as an array (objectify)
    notesContent = JSON.parse(notesContent);
    // Set new notes id
    req.body.id = notesContent.length;
    
    // Add the new note to other notes
    notesContent.push(req.body); // req.body - user input
    
    // Stringify so you can write to file
    // Writes the new note to file
    fs.writeFileSync(path.join(__dirname, `../db/db.json`), JSON.stringify(notesContent), "utf8");
    // Send it back to the browser(client)
    res.json(notesContent);
    
  });

  // ---------------------------------------------------------------------------
  // Deleting a Note
  // This code will remove the note selected and return the new array of notes
  app.delete("/api/notes/:id", function(req, res) {
    // Empty out the deleted note by id
    let removeNote = req.params.id;
    let notesContent = fs.readFileSync(path.join(__dirname, `../db/db.json`), `utf-8`);
    notesContent = JSON.parse(notesContent);
    notesContent.splice(removeNote, 1);
    
    for (let i = removeNote; i < notesContent.length; i++) {
      const note = notesContent[i];
      note.id = i;
    }

    fs.writeFileSync(path.join(__dirname, `../db/db.json`), JSON.stringify(notesContent), "utf8");
 
    res.json({ ok: true });
  });
};