import { ApiError } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';

export const validateRequest = (validationSchema) => (req, res, next) => {
  try {
    const result = validationSchema(req.body, req.params, req.query);
    if (result.errors?.length) {
      throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Validation failed', result.errors);
    }
    req.validatedData = result.data;
    next();
  } catch (error) {
    next(error);
  }
};

export default { validateRequest };
