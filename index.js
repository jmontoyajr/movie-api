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
    genre: 'Horror/Comedy'
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
app.get('/movies/:by-title/:title', (req, res) => {
   res.send('Successful GET request returning data by title');
 });

// Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get('/movies/:by-type/:genre', (req, res) => {
   res.send('Successful GET request returning genre');
 });

// Test Requests for Postman queries
app.get('/test/:foo', (req, res) => {
 res.send('Sending Foo: ' + req.params.foo);
});

app.get('/test/:bar', (req, res) => {
 res.send('Sending Bar: ' + req.params.bar);
});


// Adds data for a new user to our list of users
app.post('/movies', (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

// Update the user
app.put('/movies/:username/:age/:phone', (req, res) => {
  let user = users.find((user) => {
      return user.name === req.params.username });

  if (user) {
    user.age[req.params.age] = parseInt(req.params.phone);
    res.status(201).send('User ' + req.params.name + ' has a phone # of ' + req.params.phone + ' and is ' + req.params.age);
    } else {
      res.status(404).send('User with the name ' + req.params.name + ' was not found.');
    }
  });

// Add a movie to favorites
app.post('/movies/:favorites', (req, res) => {
    let favorite = req.body;
    
    if (!favorite.name) {
      const message = 'Missing name in request body';
      res.status(400).send(message);
    } else {
      newFavorite.id = uuid.v4();
      favorite.push(newFavorite);
      res.status(201).send(newFavorite);
  }
});
    
// Deletes a movie from favorites
app.delete('/movies/:favorites', (req, res) => {
    let favorite = favorite.find((favorite) => {
        return favorite.id === req.params.id });

    if (favorite) {
        favorite = favorite.filter((obj) => {
        return obj.id !== req.params.id });
        res.status(201).send('Favorite ' + req.params.id + ' was deleted.');
  }
});
    
// Allow user to deregister
app.delete('/movies/:username', (req, res) => {
    let user = user.find((user) => {
        return user.id === req.params.id });

    if (user) {
        user = user.filter((obj) => {
        return obj.id !== req.params.id });
        res.status(201).send('Favorite ' + req.params.id + ' was deleted.');
  }
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
