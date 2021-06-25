// Require Express
const express = require('express');
    morgan = require('morgan');

const app = express();

// Movie objects
let topMovies = [
  {
    title: 'The Matrix',
    director: 'Lana and Lilly Wachowski'
  },
  {
    title: 'The Dark Knight',
    director: 'Christopher Nolan'
  },
  {
    title: 'Jurassic Park',
    director: 'Steven Spielberg'
  },
  {
    title: 'Alien',
    director: 'Ridley Scott'
  },
  {
    title: 'Monsters Inc.',
    director: 'Pete Docter'
  },
  {
    title: 'Terminator 2: Judgment Day',
    director: 'James Cameron'
  },
  {
    title: 'Big Lebowski',
    director: 'Coen Brothers'
  },
  {
    title: 'Shaun of the Dead',
    director: 'Edgar Wright'
  },
  {
    title: 'Spider-Man: Into the Spider-Verse',
    director: 'Peter Ramsey, Bob Persichetti, Rodney Rothman'
  },
  {
    title: 'Office Space',
    director: 'Mike Judge'
  }
];

// Pulls static pages via 'public' folder
app.use(express.static('public'));

// Morgan Logger
app.use(morgan('common'));

app.get('/secreturl', (req, res) => {
  res.send('This is a secret url with super top-secret content.');
});

// Default message for the '/' on Localhost
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});

// Displays movie objects
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
