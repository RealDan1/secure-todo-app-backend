const { getToDos, addToDo, updateToDo, toggleToDo, deleteToDo } = require('../../controllers/userController');
const { jwtMiddleware } = require('../../middleware/jwtMiddleware');
const { validateInput } = require('../../middleware/validateInput');
const { validateJson } = require('../../middleware/validateJson');

const userDataRoute = (app) => {
    // GET request to /todos with JWT auth - to fetch all todos
    app.get('/todos', jwtMiddleware, getToDos);
    //POST request to add a todo (only validate JSON for Post/Put because it behaves unexpectedly when not sending a Body in the request.)
    app.post('/todos/add', jwtMiddleware, validateJson, validateInput, addToDo);
    //PUT request to update the toDo
    app.put('/todos/update/:id', jwtMiddleware, validateJson, validateInput, updateToDo);
    //PUT request to toggle the completed stat
    app.put('/toDos/toggle/:id', jwtMiddleware, validateJson, toggleToDo);
    // DELETE request to delete a toDo
    app.delete('/todos/delete/:id', jwtMiddleware, deleteToDo);
};

module.exports = userDataRoute;
