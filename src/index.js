const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const userAlreadyExist = users.find((currentUser) => currentUser.username === username);

  if (!userAlreadyExist) {
    return response.status(400).json({ error: 'Username not found' });
  }

  request.user = userAlreadyExist;

  return next();
}

function checkExistsTodo(request, response, next) {
  const { todos } = request.user;
  const { id } = request.params;

  const todo = todos.find((currentTodo) => currentTodo.id === id);

  if (!todo) {
    return response.status(404).json({ error: 'Todd not found' });
  }

  request.todo = todo;
  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExist = users.some((currentUser) => currentUser.username === username);

  if (userAlreadyExist) {
    return response.status(400).json({ error: 'Username already exists' });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    deadline: new Date(deadline),
    done: false,
    created_at: new Date(),
  };

  user.todos.push(todo);

  return response.status(201).json(...user.todos);
});

app.put('/todos/:id', checksExistsUserAccount, checkExistsTodo, (request, response) => {
  const { todo } = request;
  const { title, deadline } = request.body;

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(200).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, checkExistsTodo, (request, response) => {
  const { todo } = request;

  todo.done = true;

  return response.status(200).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, checkExistsTodo, (request, response) => {
  const { todo, user } = request;

  user.todos.splice(todo, 1);
  return response.status(204).send();
});

module.exports = app;
