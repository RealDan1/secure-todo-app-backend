const userInformation = require('./userDb');
const jwt = require('jsonwebtoken');
const fs = require('fs'); //used to write to the userDb.js
const path = require('path');
const userDbPath = path.join(__dirname, './userDb.js');

//Registration controller function:
//===========================================
const registerUser = (req, res) => {
    const { userName, password } = req.body;

    //check if the user exists in the database
    const user = userInformation.find((user) => user.userName === userName && user.password === password);
    if (user) {
        console.log('User already exists!');
        return res.status(400).json('User already exists - please enter a different username');
    }
    //otherwise create the new user and push it to userInformation
    const newUser = {
        id: userInformation.length + 1,
        userName: userName, // from req.body
        password: password, // from req.body
        toDos: [],
    };

    userInformation.push(newUser); // push new user to the array
    //add the updated userInformation to the userDb.js file:
    fs.writeFile(userDbPath, `module.exports = ${JSON.stringify(userInformation)}`, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json('Error saving user');
        }

        console.log(`User ${userName} registered`);
        res.status(200).json(
            `Registration successful: User ${userName} registered - please log in now using new username`
        );
    });
};

// Login controller function
//====================================
const loginUser = (req, res) => {
    //Get the userName and password from the request body
    const { userName, password } = req.body;
    //Find the user in the database
    const user = userInformation.find((user) => user.userName === userName && user.password === password);
    //If the user is not found, return an error message
    if (!user) {
        return res.json('Incorrect user credentials');
    }

    // Create a JWT token payload
    const payload = {
        name: userName,
        admin: false,
    };
    // sign the token with the payload
    const token = jwt.sign(JSON.stringify(payload), 'HyperionDev', {
        algorithm: 'HS256',
    });
    //The res.send() function sends a string to the client
    console.log(`User ${userName} logged in`);
    res.send({ message: `Welcome back ${userName}`, token: token });
};

// Create Todo Function (ADD)
//========================================
const addToDo = (req, res) => {
    const { name } = req.payload; //get the name from the middleware
    const { text, completed } = req.body; //get the toDo from the req body

    const user = userInformation.find((user) => user.userName === name);
    if (user) {
        const toDo = { id: Date.now(), text, completed }; //add the new data to a toDo variable - with the current date/timestamp as ID (will work fine for small scale app, can add UID later - I'm just applying KISS right now: "Keep It Simple Stupid")
        user.toDos.push(toDo); //push the new todo to the array
        // overwrite the dB with userInformation (including the new toDo added)
        fs.writeFile(userDbPath, `module.exports = ${JSON.stringify(userInformation)}`, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json('Error saving user todo');
            }

            console.log(`To-Do "${toDo}" added to user`);
            res.status(200).json({ toDos: user.toDos }); //send the new todo back to the frontend so it refreshes with correct data
        });
    }
};

// Read ToDos function (GET)
//========================================
const getToDos = (req, res) => {
    // We get the userName from the token’s payload
    const { name } = req.payload;
    //Find the user in the database - checking if the userName and password
    //matches;
    const user = userInformation.find((user) => user.userName === name);
    // If the user is found, return the todos
    if (user) {
        return res.send(user); //send the whole user file instead of just the todos so we can do fun stuff like display the user name later if needed
    } else {
        return res.status(404).send({ error: 'User not found' }); // Handle no user found
    }
};

// Update ToDo function (PUT)
//=======================================
const updateToDo = (req, res) => {
    const { id } = req.params;
    const { name } = req.payload;
    const { text } = req.body; //get the new text from the req body

    const user = userInformation.find((user) => user.userName === name);
    if (user) {
        const toDo = user.toDos.find((todo) => todo.id === parseInt(id));
        if (toDo) {
            toDo.text = text; //update the todo text

            // Overwrite userDb file
            fs.writeFile(userDbPath, `module.exports = ${JSON.stringify(userInformation)}`, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error saving updated todo' });
                }

                console.log(`Todo updated for user ${name}`);
                res.status(200).json({ toDos: user.toDos }); // Send updated todos back to the frontend
            });
        } else {
            res.status(404).json({ error: 'ToDo not found' });
        }
    } else {
        res.status(404).json({ error: 'User not found' });
    }
};

// Update Completed stat of a todo(PUT):
//=======================================
const toggleToDo = (req, res) => {
    const { id } = req.params;
    const { name } = req.payload;
    const user = userInformation.find((user) => user.userName === name);
    if (user) {
        const toDo = user.toDos.find((todo) => todo.id === parseInt(id));
        if (toDo) {
            //if the todo is found
            toDo.completed = !toDo.completed; // Toggle the completed status

            // Save the todo to userDb
            fs.writeFile(userDbPath, `module.exports = ${JSON.stringify(userInformation)}`, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error saving todo' });
                }

                console.log(`Todo updated for user ${name}`);
                res.status(200).json({ toDos: user.toDos }); // Send updated todos back to the frontend
            });
        }
    } else {
        return res.status(404).send({ error: 'User not found' }); // Handle no user found
    }
};

// Delete ToDo function (DELETE)
//=======================================
const deleteToDo = (req, res) => {
    const { id } = req.params;
    const { name } = req.payload;

    const user = userInformation.find((user) => user.userName === name);
    if (user) {
        const updatedToDos = user.toDos.filter((todo) => todo.id !== parseInt(id)); // delete todo using filter to filter out the todo with the matching id
        user.toDos = updatedToDos; // Update the todos

        // overwrite the userDb file
        fs.writeFile(userDbPath, `module.exports = ${JSON.stringify(userInformation)}`, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error deleting to-do' });
            }

            console.log(`Todo deleted for user ${name}`);
            res.status(200).json({ toDos: user.toDos }); // Send updated todos back to the frontend
        });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
};

module.exports = {
    loginUser,
    getToDos,
    addToDo,
    registerUser,
    toggleToDo,
    updateToDo,
    deleteToDo,
};
