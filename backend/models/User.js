const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
 
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, 'fullname is required'],
    minlength: [3, 'Full Name must be at least 3 characters long'],
    maxlength: [30, 'Full Name must be less than 30 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
  },
  role: {
    type: String,
    enum: {
      values: ['Job Seeker', 'Employer'],
      message: 'Role must be either "Job Seeker" or "Employer"',
    },
    required: [true, 'Role is required'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'], // Validates international format
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
