const Joi = require('joi');
const Location = require('../models/location');

const locationSchema = Joi.object({
  Address: Joi.string(),
  City: Joi.string().required(),
  Country: Joi.string().required(),
  lat: Joi.number().min(-90).max(90).allow(null),
  lng: Joi.number().min(-180).max(180).allow(null)
})


module.exports = { insert, fuzzySearch, getLocation, update, remove }

async function insert(loc) {
  await Joi.validate(loc, locationSchema, { abortEarly: false });
  return await new Location(loc).save();
}

async function update(locId, newLoc) {
  delete newLoc._id;
  delete newLoc.createdAt;
  delete newLoc.updatedAt;
  delete newLoc.confidenceScore;
  newLoc.lat = Number(newLoc.lat);
  newLoc.lng = Number(newLoc.lng);
  await Joi.validate(newLoc, locationSchema, {abortEarly: false});
  return await Location.findOneAndUpdate({_id: locId}, Object.assign(newLoc, {updatedAt: Date.now()}));
}

async function remove(locId) {
  return await Location.deleteOne({_id: locId});
}

async function fuzzySearch(searchString) {
  return await Location.fuzzySearch(searchString).limit(5).exec();
}

async function getLocation(locId) {
  if (locId && locId.length)
    return await Location.findOne({_id: locId});
  return await Location.find().exec();
}
