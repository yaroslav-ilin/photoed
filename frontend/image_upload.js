define(['backbone'], function(Backbone) {
    var Upload = Backbone.Model.extend({
        url: '/api/upload',

        file: null,

        initialize: function(file) {
            this.file = file;
            if (!(file instanceof File)) {
                throw new TypeError('upload canceled, no file specified');
            }
        },

        saveImage: function(cb) {
            // if ('image/' !== this.file.type.match('^(.+)/')[0]) {
            //     throw new Error('unexpected filetype, please specify any image');
            // }
            var form = new FormData();
            form.append('image', this.file);

            return this.save(null, {
                data: form,
                processData: false,
                contentType: false
            });
        }
    });

    var ImageUpload = Backbone.View.extend({
        el: '.photoupload',
        _input: null,

        events: {
            'change .photoupload__input': 'run'
        },

        initialize: function() {
            this._input = this.$('.photoupload__input').get(0);
            console.log(this.$('.photoupload__input'));
            // this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            console.log('render');
        },

        getFile: function() {
            return this._input.files[0];
        },

        run: function () {
            var upload = new Upload(this.getFile());
            console.log('run', upload.saveImage());
        }

    });

    return ImageUpload;
});
