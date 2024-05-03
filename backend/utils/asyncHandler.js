/**
 *
 * @param :Takes a function
 * @returns :Returns next if no error otherwise catches the error
 */

const asyncHandler = (fn) => {
  return (req, res, next) => fn(req, res, next).catch(next);
};

module.exports = asyncHandler;
