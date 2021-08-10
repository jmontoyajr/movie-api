// Integrate Mongoose with REST API
const mongoose = require('mongoose');
const Models = require('./models.js');

// Initialize Movie and User variables used in Models.js
const Movies = Models.Movie;
const Users = Models.User;

// Connect to Mongoose DB
//mongoose.connect('mongodb://localhost:27017/jFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });


// Require Express
const express = require('express');
morgan = require('morgan');
bodyParser = require('body-parser');
uuid = require('uuid');

const { check, validationResult } = require('express-validator');

const app = express();

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Require CORS
const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // if specific origin isn't found on the list of allowed origins
      let message = 'The CORS policy for this application doesn\'t allow access from origin' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }

}));

// Require Auth.js
let auth = require('./auth')(app);

// Require Passport module
const passport = require('passport');
require('./passport');

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

// Return a list of ALL movies to the user
app.get("/movies", function (req, res) {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Get a user by title
app.get('/movies/by-title/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ Title: req.params.Title })
    .then((title) => {
      res.json(title);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get movie by director
app.get('/movies/by-director/:director', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ 'Director.Name': req.params.director })
    .then((director) => {
      res.json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get director bio
app.get('/movies/by-bio/:director', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ 'Director.Name': req.params.director })
    .then((bio) => {
      res.json(bio);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get director birth year
app.get('/movies/by-birth/:director', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ 'Director.Name': req.params.director })
    .then((birth) => {
      res.json(birth);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return data about a genre
app.get('/movies/by-type/:genre', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ 'Genre.Name': req.params.genre })
    .then((Genre) => {
      res.json(Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get('/movies/by-description/:genre', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ 'Genre.Name': req.params.genre })
    .then((Genre) => {
      res.json(Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Get a user by Image Path
app.get('/movies/by-image/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ Title: req.params.Title })
    .then((title) => {
      res.json(title);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Add a user
/* We'll expect JSON in this format
{
    ID: Integer,
    Username: String,
    Password: String,
    Email: String,
    Birthday: Date
}*/
app.post('/users',
  // Validation logic request
  // you can either use a chain of methods like .not().isEmpty()
  // which means "opposite of isEmpty" in plain English "is not empty"
  // or use .isLength({min: 5}) which means
  // minimum value of 5 characters are only allowed
  [
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required.').not().isEmpty(),
    check('Email', 'Email does not appear to be valid.').isEmail()
  ], (req, res) => {

    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) { //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + 'already exists.');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.staus(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

// Update a user's info, by username
/* We'll expect JSON in this forma
 {
    Username: String,
    (required)
    Password: String,
    (required)
    Email: String,
    (required)
    Birthday: Date
} */
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
    {
      $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
    {
      $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, // This line makes sure the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

// Deletes a movie from favorites
app.delete('/movies/delete-from/favorites', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send('Successful DELETE request deleting data from favorites');
});

// Allow user to deregister
//app.delete('/user/by-id/delete', (req, res) => {
//    res.send('Successful DELETE request returning deleted user');
//  });

// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
