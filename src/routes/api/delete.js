// src/routes/api/delete.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {

  let { id } = req.params;
  try {

    const fragment = await Fragment.byId(req.user, id);
   
    if (!fragment) {
      return res.status(404).json(createErrorResponse('Fragment not found', 404));
    }
    await Fragment.delete(req.user, id);
    res.status(200).json(createSuccessResponse());
  } catch (error) {
    res.status(500).json(createErrorResponse(500, error));
  }
};
