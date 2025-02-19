function validateInput(req, res, next) {
    // Get the username from the request body
    const input = req.body.text;
    //check for empty input
    if (!input) {
        return res.status(400).json({ message: 'Input is required' });
    }

    //check the username contains gmail.com
    if (input.length <= 140) {
        next();
    } else {
        return res.status(400).json({ message: 'Maximum characters exceeded - please input less than 140 characters' });
    }
}

module.exports = { validateInput };
