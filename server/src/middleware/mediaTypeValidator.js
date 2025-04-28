const mediaTypeValidator = (req, res, next) => {
    if (req.method === "POST" || req.method === "PUT") {
        const contentType = req.headers["content-type"];

        // Validate if content-type is application/json
        if (!contentType || !contentType.includes("application/json")) {
            return res.status(415).json({ error: "Unsupported Media Type - Expected application/json" });
        }
    }

    next(); 
};

module.exports = mediaTypeValidator;