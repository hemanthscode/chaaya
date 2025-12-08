/**
 * Request Validation Middleware
 * Validates request data using validator schemas
 */

import { ApiError } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';

/**
 * Validate request using validation schema
 * @param {Function} validationSchema - Validation function from validators
 */
export const validateRequest = (validationSchema) => {
  return (req, res, next) => {
    try {
      // Run validation
      const result = validationSchema(req.body, req.params, req.query);

      // Check if validation failed
      if (result.errors && result.errors.length > 0) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.VALIDATION.REQUIRED_FIELDS,
          result.errors
        );
      }

      // Attach validated data to request
      if (result.data) {
        req.validatedData = result.data;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
