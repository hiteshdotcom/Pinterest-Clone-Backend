const mongoose = require("mongoose");

const pinsSchema = new mongoose.Schema({
  title: String,
  description: String,
  img: String,
  user: String,
  id: String
});
const Pins = mongoose.model("pins", pinsSchema);

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    savedPins: [{title: String, description: String, img: String, user: String, id: String}],
    myPins:  [{title: String, description: String, img: String, user: String, id: String}]
  },
  { collection: "users" }
);

const User = mongoose.model("user", UserSchema);

module.exports = { User, Pins };
