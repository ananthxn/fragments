// src/routes/api/get.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');


module.exports = async (req, res) => {
  try {

    const { id } = req.params;
    const ownerId = req.user;

    const fragment = await Fragment.byId(ownerId, id);

    res.status(200).json(
      createSuccessResponse({
        status: 'ok',
        fragments: fragment
      })
    );

  } catch (error) {
    res.status(404).json(createErrorResponse(404, error));
  }
};
