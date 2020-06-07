const mongoose = require('mongoose');
const mongoose_fz_search = require("mongoose-fuzzy-searching");

const LocationSchema = new mongoose.Schema({
  Address: {
    type: String,
  },
  City: {
    type: String,
    required: true
  },
  Country: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: false,
    default: null
  },
  lng: {
    type: Number,
    required: false,
    default: null
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
}, {
  versionKey: false
});

LocationSchema.index({'Address': 1, 'City': 1, 'Country': 1}, {unique: true});

LocationSchema.plugin(mongoose_fz_search,
  {
    fields: ['Address', 'City', 'Country']
  });

module.exports = mongoose.model('Location', LocationSchema);
