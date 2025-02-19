function validateUsername(req, res, next) {
    // Get the username from the request body
    const userName = req.body.userName;
    //check for empty input
    if (!userName) {
        return res.status(400).json('Username is required');
    }

    //check the username contains gmail.com
    if (userName.slice(-10) == '@gmail.com') {
        next();
    } else {
        return res.status(403).json('Invalid username - only usernames ending in @gmail.com are allowed');
    }
}

module.exports = { validateUsername };
