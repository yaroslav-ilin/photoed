const path = require('path');
const fs = require('fs');

const models = require('./models');


const Home = {
    index: (req, res) => res.sendFile('frontend/index.html', { root: path.dirname(__dirname) })
};

const Image = {

    create: function(req, res) {
        const model = new models.ImageUpload(req.file);
        model.save().then(function(image) {
            res.send({ succes: true, image });
        }, function(err) {
            console.error(err);

            res.status(400).send({
                succes: false,
                code: err.name,
                message: err.message,
                errors: Object.keys(err.errors).reduce((rv, key) => {
                    const item = err.errors[key];
                    rv.push({
                        code: item.name + '.' + item.path,
                        message: item.message
                    });
                    return rv;
                }, [])
            });
            fs.unlink(req.file.path, (err) => {});
        });
    }

};

module.exports = {
    Home,
    Image
};
