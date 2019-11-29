const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  id: Number,
  phone: Number,
  image: String,
  transactionType: String,
  school: String,
  houseType: String,
  price: Number,
  location: String,
  description: String,
});

const House = mongoose.model('House', UserSchema);

module.exports = House;