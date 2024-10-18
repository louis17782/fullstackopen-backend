import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'
import morgan from 'morgan';

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

app.use(express.static('dist'));
app.use(express.json());
app.use(morgan('tiny'));

app.get('/', (_request, response)=> {
    response.send('<h1>Hello world</h1>')
})

app.get('/api/persons', (_request, response) => {
    response.json(persons)
})

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
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    
    response.status(204).end();
  });

  const generateId = () => {
    return Math.floor(Math.random() * 1000000);
  };

  app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({error: 'Name or Number missing'})
    }

    const nameExist = persons.find(person => person.name === body.name) 
    if (nameExist) {
        return response.status(404).json({error: 'Name must be unique'})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)
    response.json(person)

  })

  app.get('*', (_request, response) => {
    response.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)