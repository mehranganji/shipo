const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
//import route rquire
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const categories = require('./routes/api/category');
const products = require('./routes/api/product');

const app = express();


//app body parser middleware

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// var path = require('path');
// app.get("/images/uploads/:image", (req, res) => {
//         res.sendFile(path.join(__dirname, ""));
//       });
// db config
const db = require('./config/keys').mongoUri;

//connect to mongoDb
mongoose.connect(db)
        .then(()=>console.log('DB is conneced!'))
        .catch(err => console.log('ERR: ', err));

//passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport)



// initial routes
app.use('/public/images/uploads/', express.static('./public/images/uploads/'));
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
app.use('/api/categories', categories);
app.use('/api/products', products);
const port = process.env.PORT || 5000;

app.listen(port, console.log(`Sever is runing on ${port}`));