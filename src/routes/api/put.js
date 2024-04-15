// src/routes/api/put.js
const express = require('express');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const router = express.Router();
const logger = require('../../logger');

router.put('/fragments/:id', async (req, res) => {
  try {

    logger.debug('PUT request', { body: req.body });
    if (!Buffer.isBuffer(req.body)) {
      return res.status(415).json(createErrorResponse(new Error('Unsupported content type'), 415));
    }

    let { id } = req.params;
    const ownerId = req.user;
    let fragment;

    try {
      fragment = new Fragment(await Fragment.byId(ownerId, id));

    } catch (error) {
      return res.status(404).json(createErrorResponse('Fragment not found'));
    }

    await fragment.save();
    logger.info(`PUT fragment saved with ID: ${fragment.id}`);

    await fragment.setData(req.body);
    logger.debug('PUT fragment data is set');

    res.set('Content-Type', fragment.type);
    res.setHeader('Location', `http://${req.headers.host}/v1/fragments/${fragment.id}`);

    res.status(201).json(createSuccessResponse({
      fragment: fragment
    }));
  } catch (error) {
    logger.error('error during POST fragment');


  }
});

module.exports = router;

