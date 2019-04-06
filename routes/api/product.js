const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');


const multer = require('multer');
const Product = require('../../models/Product');
const Category = require('../../models/Category');
// const upload = multer({ dest: "images/uploads/" });


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }

});

const upload = multer({ storage })


router.get('/test', (req, res) => res.json({ msg: 'products rute is working' }));

router.post('/upload', upload.single('image'), (req, res) => {

    if (req.file)


        res.json({

            imageUrl: `http://localhost:5000/public/images/uploads/${req.file.filename}`

        });

    else

        res.status("409").json("No Files to Upload.");

});



router.get('/', (req, res) => {
    Product.find()
        .select(['title', 'lead', 'category', 'preview_image', 'prices', 'amount'])
        .populate('category', ['title'])
        .then(products => res.json(products));
});

router.get('/product/:id', (req, res) => {
    Product.findById(req.params.id)
        .populate('category', ['title'])
        .then(product => {
            if (product) {
                return res.json(product)
            }
            res.status(404).json({ msg: 'product not found' })
        })
        .catch(err => res.json(err));
});

router.get('/category/:title', (req, res) => {


    Category.findOne({ title: req.params.title })
        .then(cat => {
            Product.find({ "category": { "$in": [cat._id] } })
                .select(['title', 'category', 'prices'])
                .populate('category', ['title'])
                .then(p => res.json(p))
                .catch(err => res.json(err));
        }).catch(err => res.json(err));
});
router.put('/update/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

    const admin = req.user.admin;
    if (!admin) {
        return res.status(400).json({ notAuth: 'you are not allow to create a category' });
    }

    Product.findById(req.params.id).then(product => {
        if (!product) {
            return res.status(404).json({ product: 'product not found' });
        }
    product.user = req.user.id;
    product.title = req.body.title;
    product.lead = req.body.lead;
    product.content = req.body.content;
    product.preview_image = req.body.preview_image;
    product.amount = req.body.amount;
    product.visible = req.body.visible;
    product.category = req.body.category;
    product.prices = req.body.prices;
    product.delivery = req.body.delivery;
    product.gallery = req.body.gallery;
    if (typeof req.body.tags !== 'undefined') product.tags = req.body.tags.split(',');
        product.save().then(product => res.json(product));

    }); //.catch(err => res.status(400).json(err))
});
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

    const admin = req.user.admin;
    if (!admin) {
        return res.status(400).json({ notAuth: 'you are not allow to create a category' });
    }
    // const prices = [];
    // req.body.prices.forEach(price => {
    //     prices.push({
    //         title: price.title,
    //         num: price.num
    //     });
    // });
    // const deliveries = [];
    // req.body.delivery.forEach(delivary => {
    //     deliveries.push({
    //         title: delivary.title,
    //         price: delivary.price
    //     });
    // });
    const newProduct = {};
    newProduct.user = req.user.id;
    newProduct.title = req.body.title;
    newProduct.lead = req.body.lead;
    newProduct.content = req.body.content;
    newProduct.preview_image = req.body.preview_image;
    newProduct.amount = req.body.amount;
    newProduct.visible = req.body.visible;
    newProduct.category = req.body.category;
    newProduct.prices = req.body.prices;
    newProduct.delivery = req.body.delivery;
    newProduct.gallery = req.body.gallery;
    if (typeof req.body.tags !== 'undefined') newProduct.tags = req.body.tags.split(',');

    new Product(newProduct).save().then(product => res.json(product));

});

router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(() => res.json({msg: 'deleting post was success'}));
});
module.exports = router;