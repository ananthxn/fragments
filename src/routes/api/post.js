// src/routes/fragments.js
const express = require('express');
const contentType = require('content-type');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const router = express.Router();

router.post('/fragments',  async (req, res, next) => {
  try {
    if (!Buffer.isBuffer(req.body)) {
      return res.status(415).json(createErrorResponse(new Error('Unsupported content type'), 415));
    }
    const { type } = contentType.parse(req.get('Content-Type'));
    const fragment = new Fragment({
      ownerId: req.user,
      type
    });

    await fragment.save();
    await fragment.setData(req.body);
  
    res.set('Content-Type', fragment.type);
    res.setHeader('Location', `http://${req.headers.host}/v1/fragments/${fragment.id}`);
    res.status(201).json(createSuccessResponse({

      fragment: fragment
    }));
  } catch (error) {
    next(createErrorResponse(error, 500));
  }
});

module.exports = router;

