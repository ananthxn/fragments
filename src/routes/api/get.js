// src/routes/api/get.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */

module.exports = async (req, res) => {
  try {
    res.status(200).json(
      createSuccessResponse({
        fragments: await Fragment.byUser(req.user, req.query.expand),
      })
    );
  } catch (error) {
    res.status(401).json(createErrorResponse(401, error));
  }
};
