const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// Prescription Schema
const PrescriptionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  drname: {
    type: String,
    required: true,
  },
  prsType:{
    type: String,
    required: true,
  },
  prsStatus:{
    type: String,
    required: true,
  },
  prsDateCreated:{
    type: Date,
    default: Date.now
  },
  prsDate:{
    type: Date,
    required: true,
  },
  contactnum:{
    type: String,
    required: true,
  },
  prsbill:{
    type: String,
    required: true
  }
});

const Prescription = module.exports = mongoose.model('Prescription', PrescriptionSchema);

module.exports.getUserById = function(id, callback){
  Prescription.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
  const query = {username: username}
  Prescription.findOne(query, callback);
}