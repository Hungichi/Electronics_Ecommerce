const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 20,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,   
    required: true,
    minlength: 6
  },

  phone: String,

  avatar: String,

  admin: {
    type: Boolean,
    default: false
  },

  addresses: [
    {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      isDefault: Boolean
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});
const User = mongoose.model('User', userSchema, 'users');

module.exports = User
