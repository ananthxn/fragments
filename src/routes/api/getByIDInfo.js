// src/routes/api/get.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');


module.exports = async (req, res) => {
  try {

    const { id } = req.params;
    const ownerId = req.user;

    // Retrieve the fragment by ID
    const fragment = await Fragment.byId(ownerId, id);

    if (!fragment) {
      return res.status(404).json(createErrorResponse('Fragment not found', 404));
    }

    res.status(200).json(
      createSuccessResponse({
        status: 'ok',
        fragments: fragment
      })
    );

  } catch (error) {
    res.status(401).json(createErrorResponse(401, error));
  }
};
