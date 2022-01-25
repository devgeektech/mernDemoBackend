const yup = require('yup');

const validate = async ({ shape, what, req, res, next }) => {
  try {
    const toValidate = req[what];
    const validated = await yup
      .object()
      .shape(shape)
      .validate(toValidate, { stripUnknown: true, abortEarly: false });
    req[what] = toValidate;
    next();
  } catch (validationErrors) {
    const allErrors = validationErrors.inner.reduce(
      (errors, currentValidation) => {
        return Object.assign(errors, {
          [currentValidation.path]: currentValidation.errors[0], //first error
        });
      },
      {}
    );
    // console.log(allErrors, 'allErrorsallErrors');

    return res
      .status(422)
      .json({ message: 'Invalid request', errors: allErrors });
  }
};

const validateQueryParams = (shape) => (req, res, next) => {
  validate({ what: 'query', shape, req, res, next });
};

const validatePostBody = (shape) => (req, res, next) => {
  validate({ what: 'body', shape, req, res, next });
};

module.exports = { validatePostBody, validateQueryParams };
