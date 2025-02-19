function validateJson(req, res, next) {
    const contentType = req.headers['content-type']; // fetch the content type from req.headers

    // Check if the content type is json
    if (contentType !== 'application/json') {
        return res.status(402).json({ message: 'wrong content type - please only send json requests' });
    }

    next();
}

module.exports = { validateJson };
