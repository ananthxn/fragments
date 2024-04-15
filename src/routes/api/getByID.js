// src/routes/api/getById.js
const express = require('express');
const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const markdownIt = require('markdown-it')();
const sharp = require('sharp');


const router = express.Router();

// GET /v1/fragments/:id 
router.get('/fragments/:id', async (req, res) => {
  try {
    let { id } = req.params;
    const ownerId = req.user;
    let format = null;

    if (id.includes('.')) {
      [id, format] = id.split('.');
    }

    const fragment = await Fragment.byId(ownerId, id);

    if (!fragment) {
      console.warn('Fragment not found with getById ', { ownerId, fragmentId: id });
      return res.status(404).json(createErrorResponse('Fragment not found', 404));
    }

    let data = await fragment.getData();
    let contentType = fragment.type;
    console.info('Fragment data retrieved using with getById ', { ownerId, fragmentId: id });

    if (format === 'html' && contentType === 'text/markdown') {
      data = markdownIt.render(data.toString());
      contentType = 'text/html';
    }
    else if (format === 'txt' && (contentType.startsWith('text') || contentType === 'application/json')) {
      data = data.toString();
      contentType = 'text/plain';
    }
    else if (contentType.startsWith('image')) {
      if (format == 'gif') {
        data = await sharp(data).gif().toBuffer();
        contentType = 'image/' + format;
      } else if (format == 'jpg' || format == 'jpeg') {
        data = await sharp(data).jpeg().toBuffer();
        contentType = 'image/' + format;
      } else if (format == 'webp') {
        data = await sharp(data).webp().toBuffer();
        contentType = 'image/' + format;
      } else if (format == 'png') {
        data = await sharp(data).png().toBuffer();
        contentType = 'image/' + format;
      }

    }

    // res.set('Content-Type', contentType);
    res.setHeader('Content-Type', contentType);
    res.status(200).send(data);
  } catch (error) {
    res.status(404).json(createErrorResponse(404, error));
  }
});

module.exports = router;
