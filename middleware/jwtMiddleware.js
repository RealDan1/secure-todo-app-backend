const jwt = require('jsonwebtoken');

function jwtMiddleware(req, res, next) {
    // 1. Get the token from the request headers
    const jwtToken = req.headers['authorization'];

    if (jwtToken) {
        // 2. Split the token from the Bearer
        const tokenExtract = jwtToken.split(' ')[1];
        try {
            // 3. Verify the token using the secret key
            const payload = jwt.verify(tokenExtract, 'HyperionDev');
            // 4. Attach the payload to the request object
            req.payload = payload;
            // 5. Proceed to the protected route
            next();
        } catch (error) {
            // 6. If token verification fails, return a forbidden response
            res.status(403).json({ message: 'Invalid token' });
        }
    }
}

module.exports = { jwtMiddleware };
