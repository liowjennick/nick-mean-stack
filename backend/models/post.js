// 3rd party app that allows schema creation (creates structure) for unstructured data
const mongoose = require('mongoose');

// creates blueprint of how your data would look like
const postSchema = mongoose.Schema({
    // learn more on mongoose docs
    title: { type: String, required: true },
    content: { type: String, required: true },
    // image path on backend
    imagePath: { type: String, required: true }
});

// schema is not the model yet
// use the model function to turn the blueprint into a model 
// first argument is model name, second argument is name of blueprint
module.exports =  mongoose.model('Post', postSchema);