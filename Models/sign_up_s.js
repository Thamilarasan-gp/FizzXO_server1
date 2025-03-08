
const mongoose = require("mongoose");
// const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },  
});

// userSchema.plugin(AutoIncrement, { inc_field: "uniqueId" });
const User = mongoose.model("User_new", userSchema);

module.exports = User;
