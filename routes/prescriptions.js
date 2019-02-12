const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Prescription = require('../models/prescription');

//Register
router.post('/register', (req,res,next) =>{
let newPrescription = new Prescription({
      name: req.body.name,
      drname: req.body.drname,
      prsStatus: req.body.prsStatus,
      prsType: req.body.prsType,
      prsDateCreated: req.body.prsDateCreated,
      prsDate: req.body.prsDate,
      contactnum: req.body.contactnum,
      prsbill: req.body.prsbill
});
    Prescription.create(newPrescription, (err, prescription)=>{
        if(err){
                res.json(
                    {
                    success: false, msg: 'failed to register prescription'
                    });
                }
        else{
            res.json(
                {
                    success: true, msg: 'Prescription Added'
                });
            }
    });
});


//Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({prescription: req.prescription});
  });

router.get('/getall', (req, res, next) => {
    Prescription.find(function(err, getPrescriptionData) {

        // if there is an error retrieving, send the error. 
                        // nothing after res.send(err) will execute
        if (err)
            res.send(err);
        else{
        res.json({ getPrescriptionData: getPrescriptionData }); 
    }
    });
});

router.get('/getprescription', function (req, res, next) {
      
    Prescription.findOne({ name: req.query.name },function (err, prescription) {
        if (err) {
            console.log("patient name err", err)
            return res.status(500).send(err)
            // return err
        }
        if(prescription.name !== req.query.name){
            return res.status(404).send('username invalid');
          }
          console.log("You are Successfully Searched: Welcome ", prescription.name)
          console.log("User_id: ", prescription._id)
          console.log("Prescription Password: ", prescription.drname)
          console.log("You created account on: ", prescription.prsType)
               return res.status(200).send(prescription);
  });
})

router.put('/update/:id', function (req, res, next) {
      
    Prescription.findByIdAndUpdate( req.params.id, req.body, {new: true}, function (err, prescription) {
        if (err) return res.status(500).send("There was a problem updating the prescription.");
        res.status(200).send(prescription);
  });
});

router.delete('/delete/:id', function (req, res) {
    Prescription.findByIdAndRemove(req.params.id, function (err, prescription) {
        if (err) { 
        return res.status(500).send("There was a problem deleting the prescription.");
    } else {
        return res.status(200).send("Prescription "+ prescription.drname +" was deleted.");
        res.json({ prescription: prescription });
    }
    });
});

module.exports = router;