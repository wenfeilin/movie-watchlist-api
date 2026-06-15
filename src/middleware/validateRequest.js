// Applied to every route requiring a req body
// Specific schema for each route

// Middleware that based on the schema passed in, allows BE to proceed w/ request or returns error message to client
export const validateRequest = (schema) => {
  return (req, res, next) => {
    // return fxn that returns req, res, next; Note: this returned fxn is the actual middleware fxn; the outside fxn is just a fxn to get the schema first
    const result = schema.safeParse(req.body); // checks if body matches the requirements of the schema

    if (!result.success) {
      // Get error messages from validation
      // Note: must flat and format err messages
      const formatted = result.error.format();

      const flatErrors = Object.values(formatted)
        .flat()
        .filter(Boolean)
        .map((err) => err._errors)
        .flat();

      console.log(flatErrors);

      return res.status(400).json({ message: flatErrors.join(", ") });
    }

    next(); // move forward if validation is successful
  };
};
