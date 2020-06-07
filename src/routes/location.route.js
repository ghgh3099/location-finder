const express = require('express');
const asyncHandler = require('express-async-handler');
const locationCtrl = require('../controllers/location');
const Joi = require('joi');
const url = require('url');

const router = express.Router();
module.exports = router;

router.route('/')
  .post(asyncHandler(insert))
  .get(asyncHandler(search));

router.route('/:locId')
  .put(asyncHandler(updateLocation))
  .delete(asyncHandler(deleteLocation))
  .get(asyncHandler(getLocations));

async function insert(req, res) {
  const user = await locationCtrl.insert(req.body);
  return res.json(user);
}

async function search(req, res) {
    const queryObj = url.parse(req.url, true).query;
    if (queryObj && queryObj.search && queryObj.search.length) {
        const docs = await locationCtrl.fuzzySearch(queryObj.search);
        return res.json(docs);
    } else {
        const docs = await locationCtrl.getLocation();
        return res.json(docs);
    }
}

async function getLocations(req, res) {
  const docs = await locationCtrl.getLocation(req.params.locId);
  return res.json(docs);
}

async function deleteLocation(req, res) {
  const result = await locationCtrl.remove(req.params.locId);
  return res.json(result);
}

async function updateLocation(req, res) {
  const doc = await locationCtrl.update(req.params.locId, req.body);
  return res.json(doc);
}
