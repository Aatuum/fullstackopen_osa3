const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());

app.use(cors());
app.use(express.static('dist'));

let persons = [
  {
    id: 1,
    name: 'Arto Hellasi',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-532523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
  {
    id: 5,
    name: 'testi',
    number: '11-11-111',
  },
];
morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number is missing' });
  }

  if (persons.find((dude) => dude.name === body.name)) {
    return res.status(404).json({
      error: 'name must be unique',
    });
  }

  const newDude = {
    id: Math.floor(Math.random() * 100),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newDude);

  res.json(newDude);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  const time = new Date();
  const allPersons = persons.length;

  response.send(
    `<p>Phonebook has info for ${allPersons} people </p> <p>${time} </p>`
  );
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const dude = persons.find((dude) => dude.id === id);
  if (dude) {
    response.json(dude);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter((dude) => dude.id !== id);
  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
