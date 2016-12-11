const mongoose = require('mongoose');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/photoed');

const filterSchema = mongoose.Schema({
    type: {
        type: String,
        enum: ['preset']
    },
    presetId: {
        type: String,
        enum: ['normal', 'claredon', 'gingham', 'moon', 'lark']
    }
}, { _id : false });

const uploadSchema = mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true,
        validate: {
          validator: v => /^image\//.test(v),
          message: 'Only images supported. Got {VALUE}'
        }
    },
    size: Number,
    filter: filterSchema
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

uploadSchema.statics.findById = function(str) {
    try {
        const _id = new mongoose.Types.ObjectId(str);
        return this.findOne({ _id });
    } catch(e) {
        return Promise.reject(e);
    }
};

uploadSchema.statics.setPresetId = function(uploadId, presetId) {
    try {
        const _id = new mongoose.Types.ObjectId(uploadId);
        return this.findOneAndUpdate({ _id }, {
            $set: {
                'filter.presetId': presetId
            }
        }, {
            new: true,
            runValidators: true
        });
    } catch(e) {
        return Promise.reject(e);
    }
};

uploadSchema.virtual('extension').get(function() {
    const rexp = /image\/([^\/]+)$/;
    switch(rexp.exec(this.mimetype)[1]) {
        case 'jpeg': return '.jpg';
        case 'gif': return '.gif';
        case 'png': return '.png';
        default: return '.image';
    }
});

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = {
    Upload
};
