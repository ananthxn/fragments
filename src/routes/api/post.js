// src/routes/fragments.js
const express = require('express');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const router = express.Router();
const logger = require('../../logger');

router.post('/fragments', async (req, res, next) => {
  try {
    logger.debug('POST request', { body: req.body });
    if (!Buffer.isBuffer(req.body)) {
      return res.status(415).json(createErrorResponse(new Error('Unsupported content type'), 415));
    }

    const fragment = new Fragment({
      ownerId: req.user,
      type: req.get('Content-Type')
    });

    await fragment.save();
    logger.info(`POST fragment saved with ID: ${fragment.id}`);

    await fragment.setData(req.body);
    logger.debug('POST fragment data is set');

    res.set('Content-Type', fragment.type);
    res.setHeader('Location', `http://${req.headers.host}/v1/fragments/${fragment.id}`);
    res.status(201).json(createSuccessResponse({

      fragment: fragment
    }));
  } catch (error) {
    logger.error('error during POST fragment');
    next(createErrorResponse(error, 500));
  }
});

module.exports = router;

