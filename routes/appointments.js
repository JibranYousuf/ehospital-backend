const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Appointment = require('../models/appointment');

//Register
router.post('/register', (req,res,next) =>{
let newAppointment = new Appointment({
      name: req.body.name,
      drname: req.body.drname,
      aptStatus: req.body.aptStatus,
      aptType: req.body.aptType,
      aptDateCreated: req.body.aptDateCreated,
      aptDate: req.body.aptDate,
      contactnum: req.body.contactnum
});
    Appointment.create(newAppointment, (err, appointment)=>{
        if(err){
                res.json(
                    {
                    success: false, msg: 'failed to register appointment'
                    });
                }
        else{
            res.json(
                {
                    success: true, msg: 'Appointment Added'
                });
            }
    });
});


//Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({appointment: req.appointment});
  });

router.get('/getall', (req, res, next) => {
    Appointment.find(function(err, getAppointmentData) {

        // if there is an error retrieving, send the error. 
                        // nothing after res.send(err) will execute
        if (err)
            res.send(err);
        else{
        res.json({ getAppointmentData: getAppointmentData }); 
    }
    });
});

router.get('/getappointment', function (req, res, next) {
      
    Appointment.findOne({ name: req.query.name },function (err, appointment) {
        if (err) {
            console.log("patient name err", err)
            return res.status(500).send(err)
            // return err
        }
        if(appointment.name !== req.query.name){
            return res.status(404).send('username invalid');
          }
          console.log("You are Successfully Searched: Welcome ", appointment.name)
          console.log("User_id: ", appointment._id)
          console.log("Appointment Password: ", appointment.password)
          console.log("You created account on: ", appointment.userType)
               return res.status(200).send(appointment);
  });
})

router.put('/update/:id', function (req, res, next) {
      
    Appointment.findByIdAndUpdate( req.params.id, req.body, {new: true}, function (err, appointment) {
        if (err) return res.status(500).send("There was a problem updating the appointment.");
        res.status(200).send(appointment);
  });
});

router.delete('/delete/:name/:id', function (req, res) {
    Appointment.findByIdAndRemove(req.params.id, function (err, appointment) {
        if (err) { 
        return res.status(500).send("There was a problem deleting the appointment.");
    } else {
        return res.status(200).send("Appointment "+ appointment.drname +" was deleted.");
        res.json({ appointment: appointment });
    }
    });
});

module.exports = router;