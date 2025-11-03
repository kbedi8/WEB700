/********************************************************************************
*  WEB700 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Kunwar Bedi   Student ID: 106681232 Date: 2 November 2025
*

*
********************************************************************************/

const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

const LegoData = require('./data/legoData');

// identify public folder for static files
app.use(express.static(path.join(__dirname, 'public')));

// create an instance of LegoData
const lego = new LegoData();

// routes serving static html files from views
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// route to display lego sets in a simple HTML
app.get('/lego/sets', (req, res) => {
  const sets = lego.getAllSets();
  // produce a simple HTML page showing current sets
  let html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8"/>
      <title>Lego Sets</title>
      <link rel="stylesheet" href="/css/theme.css">
    </head>
    <body>
      <nav class="navbar bg-light">
        <div class="navbar-brand">Kunwar's Lego Collection</div>
        <div class="nav-links"><a class="nav-link" href="/">Home</a> | <a class="nav-link" href="/about">About</a></div>
      </nav>
      <main class="container">
        <h1>All Lego Sets</h1>
        <p>Below are the LEGO sets currently in the memory of this running app.</p>
        <div class="sets-grid">
  `;
  sets.forEach(s => {
    html += `
      <article class="set-card">
        <img src="${s.img_url}" alt="Image for ${s.name}" />
        <h3>${s.name} (${s.set_num})</h3>
        <p>Year: ${s.year} • Theme ID: ${s.theme_id} • Parts: ${s.num_parts}</p>
      </article>
    `;
  });

  html += `
        </div>
        <p><a href="/lego/add-test">Add a test set (visit once to add; repeat to see error)</a></p>
      </main>
    </body>
  </html>
  `;
  res.send(html);
});

// route implementing add-test as per assignment spec
app.get('/lego/add-test', (req, res) => {
  const testSet = {
    set_num: "123",
    name: "testSet name",
    year: "2024",
    theme_id: "366",
    num_parts: "123",
    img_url: "https://fakeimg.pl/375x375?text=[+Lego+]"
  };

  lego.addSet(testSet)
    .then(() => {
      // successful -> redirect to /lego/sets
      res.redirect('/lego/sets');
    })
    .catch(err => {
      // unsuccessful -> set 422 and return the error
      res.status(422).send({ error: err });
    });
});

// fallback 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
