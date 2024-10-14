require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const Person = require('./person');

app.use(express.json());

app.use(cors());
app.use(express.static('dist'));

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  // Palauttaa yleisen virheilmoituksen
  response.status(500).json({ error: 'Ooops... Something went wrong' });
  next(error);
};

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number is missing' });
  }

  // katsotaan ja etsitään että ei ole samaa nimeä
  Person.findOne({ name: body.name })
    .then((nameDup) => {
      if (nameDup) {
        // Jos on samalla nimellä oleva
        return res.status(400).json({ error: 'name must be unique' });
      }

      // Luodaan uusi henkilo
      const newDude = new Person({
        name: body.name,
        number: body.number,
      });

      // Tallennetaan tietokantaan
      return newDude.save();
    })
    .then((tallenna) => {
      if (tallenna) {
        res.json(tallenna);
      }
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;
  const updatedPerson = {
    name,
    number,
  };

  Person.findByIdAndUpdate(request.params.id, updatedPerson, {
    new: true,
  })
    .then((upPerson) => {
      if (upPerson) {
        response.json(upPerson);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then((maara) => {
      const aika = new Date();
      response.send(
        `<p>Phonebook has info for ${maara} people </p> <p>${aika} </p>`
      );
    })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

//Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
