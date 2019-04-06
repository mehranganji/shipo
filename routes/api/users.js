const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

const validateregisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// test uri
router.get('/test', (req, res)=> res.json({msg: "users routes was worked"}));


//register user
router.post('/register', (req, res) => {

    const {errors, isValid} = validateregisterInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({email: req.body.email})
        .then(user => {
            if(user)
            {
                errors.email = 'this email is already exist';
                return res.status(400).json(errors)
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: "200",
                    r: "pg",
                    d: "mm"
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });
                // bcrypt.getSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, bcrypt.genSaltSync(10), (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    });
                // });
            }
        })
});

router.post('/login', (req, res)=> {
    const {errors, isValid} = validateLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;

    // find user by email
    User.findOne({email})
        .then(user => {
            if(!user) {
                errors.email = 'user not found';
                return res.status(404).json(errors);
            } 
            //match user password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                       
                        const payLoad = {id: user.id, name: user.name, avatar:user.avatar, admin: user.admin} //jwt payload

                        jwt.sign(payLoad, keys.secretOrKey, {expiresIn: 3600},
                             (err, token) =>{ res.json({
                                 success: true,
                                 token: "Bearer " + token
                                })})
                    } else {
                        errors.password = 'password was incorrect';
                        res.status(400).json(errors);
                    }
                })
        });
});

router.get('/current', 
passport.authenticate('jwt', {session: false}), 
(req, res)=>{
    res.json(req.user);
});

router.post('/admin/:id', passport.authenticate('jwt', {session: false}), (req, res)=>{
    User.findById(req.params.id)
        .then(user=>{
            if(!user)
            {
                return res.status(404).json({noUser: 'user not found'});
            }
            user.admin = !user.admin;
            user.save().then(user => res.json(user));
        }).catch(err => res.status(400).json(err));
});
module.exports = router;