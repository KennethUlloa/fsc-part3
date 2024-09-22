const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

let persons = [
  { 
    id: "1",
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: "2",
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: "3",
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: "4",
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
]

const unknownEndpoint = (_, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
}

// Define body token
morgan.token('body', (req) => JSON.stringify(req.body));

app.use(cors());
app.use(express.static('client'));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


app.get('/info', (_, res) => {
  res.status(200).send(`Phonebook has info for ${persons.length} people<br>${new Date()}`);
});

app.get('/api/persons', (req, res) => {
  const params = req.query;
  if (params.name) {
    const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(params.name.toLowerCase()));
    return res.json(filteredPersons);
  }
  console.log(params);
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(person => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: 'Person not found' });
  }
});

app.post('/api/persons', (req, res) => {
  const person = req.body;
  console.log("Request", person);
  if (!person.name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (!person.number) {
    return res.status(400).json({ error: 'Number is required' });
  }

  if (persons.find(p => p.name === person.name)) {
    return res.status(400).json({ error: 'Name must be unique' });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000).toString(),
    name: person.name,
    number: person.number
  }

  persons = persons.concat(newPerson);
  res.status(201).json(newPerson);
});


app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(person => person.id === id);
  if (!person) {
    return res.status(404).json({ error: 'Person not found' });
  }
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

app.use(unknownEndpoint)

const PORT = 3001 | process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});