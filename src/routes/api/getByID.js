const express = require('express');
const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');

const router = express.Router();

// GET /v1/fragments/:id 
router.get('/fragments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user;

    // Retrieve the fragment by ID
    const fragment = await Fragment.byId(ownerId, id);

    if (!fragment) {
      console.warn('Fragment not found with getById ', { ownerId, fragmentId: id });
      return res.status(404).json(createErrorResponse('Fragment not found', 404));
    }
    const data = await fragment.getData();
    console.info('Fragment data retrieved using with getById ', { ownerId, fragmentId: id });

    res.set('Content-Type', fragment.type);
    res.status(200).send(data);
  } catch (error) {
    res.status(404).json(createErrorResponse(404, error));
  }
});

module.exports = router;