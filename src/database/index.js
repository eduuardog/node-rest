const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/noderest');


module.exports = mongoose;