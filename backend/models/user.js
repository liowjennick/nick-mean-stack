const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// creates blueprint of how your data would look like
const userSchema = mongoose.Schema({
    // unique is not a validator, it allows mongoose to optimize itself
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// adding mongoose plugins
userSchema.plugin(uniqueValidator);

// schema is not the model yet
// use the model function to turn the blueprint into a model 
// first argument is model name, second argument is name of blueprint
module.exports =  mongoose.model('User', userSchema);