var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var ListSchema = new mongoose.Schema({
    email: String,
    favoritas: [{
        id: Number,
        media_type: String
    }], 
    porVer: [{
        id: Number,
        media_type: String
    }], 
    vistas: [{
        id: Number,
        media_type: String
    }] 
});

ListSchema.plugin(mongoosePaginate);
const List = mongoose.model('List', ListSchema);

module.exports = List;
