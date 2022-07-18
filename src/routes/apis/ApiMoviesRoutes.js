const express = require('express');
const router = express.Router();
const {list, newmo , recomended, detail, create, update, destroy} = require('../../controllers/apis/ApiMoviesController');

router
    .get('/', list)
    .get('/new', newmo)
    .get('/recommended', recomended)
    .get('/:id', detail)
    .post('/', create)
    .put('/:id', update)
    .delete('/:id', destroy)

module.exports = router;