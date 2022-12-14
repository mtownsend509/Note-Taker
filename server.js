const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3001;

const path = require('path');

//importing the json files that has the notes
//const notes = require("note pathway goes here");
// const requestedNotes = req.params

// //sets up express to handle data parsing?
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});


app.get("/api/notes", (req, res) => {
   const notes = require('./db/db.json');
   console.log(notes.length);
   console.log('notes getten')
   return res.json(notes)
})

app.post("/api/notes", (req, res) => {
    console.log(req.body);
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



// //defaults to index.jtml?
app.use(express.static('./public'))


// app.get("/send", (req, res) => res.sendFile(path.join(__dirname, "public/send.html")));

// app.get("/api", (req, res) => {
//     res.json(notes) //after the notes are saved
// })

// res.json() //sends stuff as a json object

app.listen(PORT, () =>
    console.log('Server is up and listening')
);