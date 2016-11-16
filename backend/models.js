const mongoose = require('mongoose');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/photoed');

const ImageUpload = mongoose.model('PhotoUpload', {
    originalname: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        validate: {
          validator: v => /^image\//.test(v),
          message: 'Only uploads of image types are allowed. Got {VALUE}'
        }
    },
    filename: {
        type: String,
        required: true
    },
    size: Number
});

module.exports = {
    ImageUpload
};
