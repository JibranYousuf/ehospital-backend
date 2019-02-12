const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

//Register
router.post('/register', (req,res,next) =>{
let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    userType: req.body.userType
});
    User.addUser(newUser, (err, user)=>{
        if(err){
                res.json(
                    {
                    success: false, msg: 'failed to register user'
                    });
                }
        else{
            res.json(
                {
                    success: true, msg: 'User Registered'
                });
            }
    });
});

//Authenticate
router.post('/authenticate', (req,res) =>{
   
        const username = req.body.username;
        const password = req.body.password; 
        User.getUserByUsername(username, (err, user) =>{
        if(err) throw err;
        if(!user){
            return res.json({
                success: false, msg: 'user not found'
                            });
        }
        User.comparePassword(password, user.password, (err, isMatch) =>{
            if(err) throw err;
            if(isMatch){
                let payload = {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    userType: user.userType
                };
                const token = jwt.sign(payload, config.secret, {
                    expiresIn: 604800  //1 week
                });
                return res.json({
                    success: true,
                    token: 'bearer '+ token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email : user.email,
                        userType : user.userType,
                    }
                });
            } else {
                return res.json({success: false, msg: 'wrong password'});
            }
        });
    });
});

//Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
  });

router.get('/getall', (req, res, next) => {
    User.find(function(err, getData) {

        // if there is an error retrieving, send the error. 
                        // nothing after res.send(err) will execute
        if (err)
            res.send(err);
        else{
        res.json({ getData: getData }); 
    }
    });
});

router.get('/getdoc', (req, res, next) => {
    User.find({userType: 'Doctor'},function(err, getDocData) {

        // if there is an error retrieving, send the error. 
                        // nothing after res.send(err) will execute
        if (err)
            res.send(err);
        else{
        res.json({ getDocData: getDocData }); 
    }
    });
});

router.get('/getpatient', (req, res, next) => {
    User.find({userType: 'Patient'},function(err, getPatientData) {

        // if there is an error retrieving, send the error. 
                        // nothing after res.send(err) will execute
        if (err)
            res.send(err);
        else{
        res.json({ getPatientData: getPatientData }); 
    }
    });
});
router.get('/getstaff', (req, res, next) => {
    User.find({userType: 'Staff'},function(err, getStaffData) {

        // if there is an error retrieving, send the error. 
                        // nothing after res.send(err) will execute
        if (err)
            res.send(err);
        else{
        res.json({ getStaffData: getStaffData }); 
    }
    });
});
router.get('/getadmin', (req, res, next) => {
    User.find({userType: 'Admin'},function(err, getAdminData) {

        // if there is an error retrieving, send the error. 
                        // nothing after res.send(err) will execute
        if (err)
            res.send(err);
        else{
        res.json({ getAdminData: getAdminData }); 
    }
    });
});

router.get('/getuser', function (req, res, next) {
      
    User.findOne({ username: req.query.username },function (err, user) {
        if (err) {
            console.log("username err", err)
            return res.status(500).send(err)
            // return err
        }
        if(user.username !== req.query.username){
            return res.status(404).send('username invalid');
          }
          console.log("You are Successfully Searched: Welcome ", user.username)
          console.log("User_id: ", user._id)
          console.log("User Password: ", user.password)
          console.log("You created account on: ", user.userType)
               return res.status(200).send(user);
  });
})

router.put('/update/:id', function (req, res, next) {
      
    User.findByIdAndUpdate( req.params.id, req.body, {new: true}, function (err, user) {
        console.log(user);
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
  });
});

router.delete('/delete/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) { 
        return res.status(500).send("There was a problem deleting the user.");
    } else {
        return res.status(200).send("User "+ user.username +" was deleted.");
        res.json({ user: user });
    }
    });
});

module.exports = router;