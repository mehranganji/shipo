const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        required: true
    },
    lead: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    visible: {
        type:Boolean,
        default: true,
    },
    preview_image: {
        type: String,
        default: 'http://localhost:5000/public/images/uploads/0bg.jpg'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    off_price: {
        type: Number,
    },
    amount: {
        type: Number,
        required : true
    },
    prices: [
        {
            title: {
                type: String,
                required: true,
            },
            num: {
                type: Number,
                required: true
            }
        }
    ],
    delivery: [
        {
            title:{
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    tags: {
            type:[String]
        },
    comments: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
          },
          text: {
            type: String,
            required: true
          },
          name: {
            type: String
          },
          avatar: {
            type: String
          },
          date: {
            type: Date,
            default: Date.now
          }
        }
      ],
      gallery:[
          {
            image:{
                type: String,
                default:'http://localhost:5000/public/images/uploads/0bg.jpg'
            }
          }
      ],
      date: {
          type: Date,
          default: Date.now
      }
});

module.exports = Product = mongoose.model('products', ProductSchema);