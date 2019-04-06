const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Category = require('../../models/Category');

router.get('/test', (req, res) => {
    res.json({category: 'categories route is working'});
});

router.get('/', (req, res)=>{
    Category.find()
        // .select('title')
        // .populate('user', ['name', 'admin'])
        .then(categories => res.json(categories))
        .catch(err => res.status(400).json(err));
})
router.post('/', passport.authenticate('jwt', {session: false}), (req, res)=> {
    // const { errors, isValid } = validatePostInput(req.body);
    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }
    const user = req.user.admin;
    if(!user){
        return res.status(400).json({notAuth: 'you are not allow to create a category'});
    }
    const newCategory = new Category({
        user: req.user.id,
        title: req.body.title,
        visible: req.body.visible
    });

    newCategory.save()
        .then(category => res.json(category))
        .catch(err=> res.status(400).json(err))
});
module.exports = router;