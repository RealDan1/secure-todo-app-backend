const { loginUser } = require('../controllers/userController');

//Login Route:
const loginRoute = (app) => {
    app.post('/login', loginUser);
};

module.exports = loginRoute;
