const { registerUser } = require('../controllers/userController');
const { validateUsername } = require('../middleware/validateUsername');

//Login Route:
const registerRoute = (app) => {
    app.post('/register', validateUsername, registerUser);
    //This route URL will be http://localhost:8080/login
};

module.exports = registerRoute;
