// Integrate Mongoose with REST API
const mongoose = require('mongoose');
const Models = require('./models.js');

// Initialize Movie and User variables used in Models.js
const Movies = Models.Movie;
const Users = Models.User;

// Connect to Mongoose DB
mongoose.connect('mongodb://localhost:27017/jFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Require Express
const express = require('express');
    morgan = require('morgan');
    bodyParser = require('body-parser');
    uuid = require('uuid');

const app = express();

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


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
app.get('/movies', (req, res) => {
    Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Get a user by title
app.get('/movies/by-title/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((title) => {
            res.json(title);
        })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Get movie by director
//app.get('/movies/by-director/:Director', (req, res) => {
//    Movies.find({ 'Director.Name': 'Jonathan Demme' })
//        .then((director) => {
//            res.json(director);
//        })
//    .catch((err) => {
//        console.error(err);
//        res.status(500).send('Error: ' + err);
//    });
//});

//app.get('/movies/by-director/:director', (req, res) => {
//   res.send('Successful GET request returning data by director');
// });

// Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get('/movies/by-type/:genre', (req, res) => {
    Movies.find({ 'Genre.Name':'Thriller'  })
        .then((Genre) => {
            res.json(Genre);
        })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/by-type/:genre', (req, res) => {
    Movies.find({ 'Genre.Name':'Action'  })
        .then((Genre) => {
            res.json(Genre);
        })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/by-type/:genre', (req, res) => {
    Movies.find({ 'Genre.Name':'Horror'  })
        .then((Genre) => {
            res.json(Genre);
        })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/by-type/:genre', (req, res) => {
    Movies.find({ 'Genre.Name':'Comedy'  })
        .then((Genre) => {
            res.json(Genre);
        })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/by-type/:genre', (req, res) => {
    Movies.find({ 'Genre.Name':'Horror Comedy'  })
        .then((Genre) => {
            res.json(Genre);
        })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/by-type/:genre', (req, res) => {
    Movies.find({ 'Genre.Name':'Animated'  })
        .then((Genre) => {
            res.json(Genre);
        })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Get a user by Image Path
app.get('/movies/by-title/:ImagePath', (req, res) => {
    Movies.findOne({ ImagePath: req.params.ImagePath })
        .then((image) => {
            res.json(image);
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
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists.');
            } else {
              Users
                .create({
                    Username: req.body.Username,
                    Password: req.body.Password,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                })
                .then((user) =>{res.staus(201).json(user) })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                })
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
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username },
    {  $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
    { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if(err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
              res.json(updatedUser);
            }
    });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
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
app.delete('/movies/delete-from/favorites', (req, res) => {
    res.send('Successful DELETE request deleting data from favorites');
  });
    
// Allow user to deregister
//app.delete('/user/by-id/delete', (req, res) => {
//    res.send('Successful DELETE request returning deleted user');
//  });

// Delete a user by username
app.delete('/users/:Username', (req, res) => {
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
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
