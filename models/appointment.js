const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// Appointment Schema
const AppointmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  drname: {
    type: String,
    required: true,
  },
  aptType:{
    type: String,
    required: true,
  },
  aptStatus:{
    type: String,
    required: true,
  },
  aptDateCreated:{
    type: Date,
    default: Date.now
  },
  aptDate:{
    type: Date,
    required: true,
  },
  contactnum:{
    type: String,
    required: true,
  },
});

const Appointment = module.exports = mongoose.model('Appointment', AppointmentSchema);

module.exports.getUserById = function(id, callback){
  Appointment.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
  const query = {username: username}
  Appointment.findOne(query, callback);
}