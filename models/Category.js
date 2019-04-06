const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:'users'
    },
    title: {
        type: String,
        required:true,
    },
    visible: {
        type: Boolean,
        default: true
    },
    off_price: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports = Category = mongoose.model('categories', CategorySchema);