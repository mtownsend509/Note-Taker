const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

const path = require('path');

// //sets up express to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//sends the notes html page with the /notes param
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//gives the notes list with the getNotes function
app.get("/api/notes", (req, res) => {
   const notes = require('./db/db.json');
   console.log('notes getten')
   return res.json(notes)
})

//adds the notes to the note list with a random ID#
app.post("/api/notes", (req, res) => {
    const { title, text} = req.body;
    
    const newNote = {
        title,
        text,
        id: Math.floor(Math.random()*10000),
    }
    const noteString = JSON.stringify(newNote);
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err)
        } else {
            const parsedNotes = JSON.parse(data);
            parsedNotes.push(newNote);
            fs.writeFile(`./db/db.json`, JSON.stringify(parsedNotes, null, 2), (err) => 
       err
      ? console.error(err)
      :console.log('new note posted!'));
        }
    })
    
    return res.json(newNote);
});

//hopefully splices out the notes from the notes list based on ID match
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err)
        } else {
            const parsedData = JSON.parse(data);
            for(i=0; i<parsedData.length; i++) {
                if (req.params.id == parsedData[i].id) {
                      parsedData.splice(i, 1);
                      fs.writeFile(`./db/db.json`, JSON.stringify(parsedData, null, 2), (err) => 
                     err
                    ? console.error(err)
                    :console.log('new note posted!'));
                } else {
                    console.log('nope');
                }
            }
        }
    })
});

// //defaults to index.html
app.use(express.static('./public'))

app.listen(PORT, () =>
    console.log('Server is up and listening')
);