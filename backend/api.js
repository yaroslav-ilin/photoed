const fs = require('fs');


module.exports = {

    saveImage: function(image) {
        return new Promise(function(resolve, reject) {
            fs.readFile(image.path, function (err, data) {
                if ('image/' !== image.mimetype.match(/^(.+)\//)[0]) {
                    reject(new Error('unexpected mimetype ' + image.mimetype));
                }
                const imageName = image.name;
                if (!imageName) {
                    reject(new Error('no image file name'));
                } else {
                    const newPath = __dirname + "/uploads/fullsize/" + imageName;
                    fs.writeFile(newPath, data, function (err) {
                        resolve(imageName);
                    });
                }
            });
        });
    }

};
