// Require Express
const express = require('express');
    morgan = require('morgan');
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

// Movie objects
let topMovies = [
  {
    title: 'The Matrix',
    director: 'Lana and Lilly Wachowski',
    genre: 'Action'
  },
  {
    title: 'The Dark Knight',
    director: 'Christopher Nolan',
    genre: 'Action'
  },
  {
    title: 'Jurassic Park',
    director: 'Steven Spielberg',
    genre: 'Blockbuster'
  },
  {
    title: 'Alien',
    director: 'Ridley Scott',
    genre: 'Horror'
  },
  {
    title: 'Monsters Inc.',
    director: 'Pete Docter',
    genre: 'Animated'
  },
  {
    title: 'Terminator 2: Judgment Day',
    director: 'James Cameron',
    genre: 'Action'
  },
  {
    title: 'Big Lebowski',
    director: 'Coen Brothers',
    genre: 'Comedy'
  },
  {
    title: 'Shaun of the Dead',
    director: 'Edgar Wright',
    genre: 'Horror Comedy'
  },
  {
    title: 'Spider-Man: Into the Spider-Verse',
    director: 'Peter Ramsey, Bob Persichetti, Rodney Rothman',
    genre: 'Animated'
  },
  {
    title: 'Office Space',
    director: 'Mike Judge',
    genre: 'Comedy'
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

// Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
   res.send('Successful GET request returning data on all the movies');
 });

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get('/movies/by-title/:title', (req, res) => {
   res.send('Successful GET request returning data by title');
 });

app.get('/movies/by-director/:director', (req, res) => {
   res.send('Successful GET request returning data by director');
 });

// Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get('/movies/by-type/:genre', (req, res) => {
   res.send('Successful GET request returning genre');
 });

// Adds data for a new user to our list of users
app.post('/user', (req, res) => {
    res.send('Successful POST request returning data for new user');
  });

// Update the user
app.put('/user/by-id/update', (req, res) => {
    res.send('Successful PUT request returning user update');
  });

// Add a movie to favorites
app.post('/movies/add-to/favorites', (req, res) => {
    res.send('Successful POST request returning movies added to favorites');
  });
    
// Deletes a movie from favorites
app.delete('/movies/delete-from/favorites', (req, res) => {
    res.send('Successful DELETE request deleting data from favorites');
  });
    
// Allow user to deregister
app.delete('/user/by-id/delete', (req, res) => {
    res.send('Successful DELETE request returning deleted user');
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
