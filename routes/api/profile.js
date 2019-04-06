const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// load validation rules
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');


// test route for profile routes
router.get('/test', (req, res)=> res.json({msg: "Profile routes was worked"}));

// get all users profile
router.get('/all', (req, res) =>{
    Profile.find()
    .populate('user', ['name','avatar'])
    .then(profiles =>{
        if(!profiles){
            return res.status(404).json({profiles: 'there is no profile'});
        }
        return res.json(profiles);
    })
    .catch(err => res.json(err));
});

// get user profile in public by handle
router.get('/handle/:handle', (req, res)=> {
    const errors ={};
    Profile.findOne({handle: req.params.handle})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.profile = 'ther is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.json(404).json(err));
});

// get user profile in public by id
router.get('/user/:user_id', (req, res)=> {
    const errors ={};
    Profile.findOne({user: req.params.user_id})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.profile = 'ther is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.json(404).json(err));
});

//get user profile
router.get('/', passport.authenticate('jwt', {session: false}), (req, res)=>{
    const errors = {};
    Profile.findOne({user: req.user.id})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noProfile = 'there is no profile for this user';
               return res.status(404).json(errors);
            }
            res.json(profile)
        })
        .catch(err => res.status(404).json(err))
});


//create a profile for user
router.post('/', passport.authenticate('jwt', {session: false}), (req, res)=>{

    const {errors, isValid} = validateProfileInput(req.body)
    if(!isValid) {
        return res.status(400).json(errors);
    }
    const profileFileds = {};
    profileFileds.user = req.user.id;
    if(req.body.handle) profileFileds.handle = req.body.handle;
    if(req.body.company) profileFileds.company = req.body.company;
    if(req.body.website) profileFileds.website = req.body.website;
    if(req.body.location) profileFileds.location = req.body.location;
    if(req.body.status) profileFileds.status = req.body.status;
    if(req.body.bio) profileFileds.bio = req.body.bio;
    if(req.body.gitubusername) profileFileds.gitubusername = req.body.gitubusername;
    
    if(typeof req.body.skills !== 'undefined') profileFileds.skills = req.body.skills.split(',');
    
    profileFileds.social = {};
    if(req.body.youtube) profileFileds.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFileds.social.twitter = req.body.twitter;
    if(req.body.facebook) profileFileds.social.facebook = req.body.facebook;
    if(req.body.linkedin) profileFileds.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFileds.social.instagram = req.body.instagram;

    Profile.findOne({user: req.user.id})
        .then(profile => {
            if(profile) {
                Profile.findOneAndUpdate(
                    {user: req.user.id}, 
                    {$set: profileFileds}, 
                    {new: true}).then(profile => res.json(profile));
            } else {
                Profile.findOne({handle: profileFileds.handle}).then(profile => {
                    if(profile) {
                        errors.profile = 'this handle is already exist';
                       return res.status(400).json(errors);
                    }

                    new Profile(profileFileds).save().then(profile => res.json(profile));
                })
            }
        });

});

router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
      const { errors, isValid } = validateExperienceInput(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }
  
      Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newExp = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
            };
  
            // Add to exp array
            profile.experience.unshift(newExp);
    
            profile.save().then(profile => res.json(profile));
      });
});

router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
          const { errors, isValid } = validateEducationInput(req.body);
          if (!isValid) {
            return res.status(400).json(errors);
          }
      
          Profile.findOne({ user: req.user.id }).then(profile => {
            const newEdu = {
              school: req.body.school,
              degree: req.body.degree,
              fieldofstudy: req.body.fieldofstudy,
              from: req.body.from,
              to: req.body.to,
              current: req.body.current,
              description: req.body.description
            };
      
            // Add to exp array
            profile.education.unshift(newEdu);
      
            profile.save().then(profile => res.json(profile));
          });
});

router.delete( '/experience/:exp_id',  passport.authenticate('jwt', { session: false }), (req, res) => {
      Profile.findOne({ user: req.user.id })
        .then(profile => {
          const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);
  
          profile.experience.splice(removeIndex, 1);
          profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
    }
  );

router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
      Profile.findOne({ user: req.user.id })
        .then(profile => {
          const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);
  
          
          profile.education.splice(removeIndex, 1);
          profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
    }
  );
  

router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
      Profile.findOneAndRemove({ user: req.user.id }).then(() => {
        User.findOneAndRemove({ _id: req.user.id }).then(() =>
          res.json({ success: true })
        );
      });
});

module.exports = router;