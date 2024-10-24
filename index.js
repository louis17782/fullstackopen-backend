import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'
import morgan from 'morgan';
import cors from 'cors';
import Person from "./models/persons.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    },

]

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(morgan('tiny'));

app.get('/', (_request, response)=> {
    response.send('<h1>Hello world this is Louis</h1>')
})

app.get('/api/persons', (_request, response) => {
    Person.find({}).then(persons => {
      response.json(persons);
    });
  });

app.get('/info', (_request, response) => {
    const totalPersons = persons.length;
    const requestTime = new Date();

    response.send(
     `<p>Phonebook has info for ${totalPersons} people</p>
     <p>${requestTime}</p>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if(person) {
        response.json(person)
    } else {
        console.log('x')
        response.status(404).send({error: 'Person not found'})
    }
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        if (result) {
          response.status(204).end();
        } else {
          response.status(404).send({ error: 'Person not found' });
        }
      })
      .catch(error => {
        console.log(error);
        response.status(500).send({ error: 'malformatted id' });
      });
  });
  

  app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({error: 'Name or Number missing'})
    }

    const person = new Person ({
        name: body.name,
        number: body.number,
    })
    
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
  })

  app.get('*', (_request, response) => {
    response.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });

  const errorHandler = (error, request, response, next) => {
    console.error(error.message);
  
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return response.status(400).send({ error: 'malformatted id' });
    }
  
    next(error);
  };
  
  app.use(errorHandler);

const PORT = process.env.PORT  || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})