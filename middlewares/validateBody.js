const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error && error.message === "missing field favorite") {
      throw HttpError(400, "missing field favorite");
    }

    if (error && error.message === "missing required field EMAIL") {
      throw HttpError(400, "missing required field EMAIL");
    }

    if (JSON.stringify(req.body) === "{}") {
      throw HttpError(400, "missing fields");
    }
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

module.exports = validateBody;
