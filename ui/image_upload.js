define(['backbone'], function(Backbone) {
    var Upload = Backbone.Model.extend({
        url: '/api/upload',

        file: null,
        filter: {
            type: 'preset',
            presetId: 'normal'
        },

        initialize: function(file) {
            this.file = file;
            if (!(file instanceof File)) {
                throw new TypeError('upload canceled, no file specified');
            }
        },

        save: function(a,b,c) {
            // if ('image/' !== this.file.type.match('^(.+)/')[0]) {
            //     throw new Error('unexpected filetype, please specify any image');
            // }
            var form = new FormData();
            form.append('image', this.file);

            return Backbone.Model.prototype.save.call(this, null, {
                data: form,
                processData: false,
                contentType: false
            });
        }
    });

    var ImageUpload = Backbone.View.extend({
        el: '.imageupload',
        _preview: null,
        _input: null,

        events: {
            'click': 'choose',
            'change .imageupload__input': 'upload'
        },

        initialize: function() {
            this._input = this.$('.imageupload__input').get(0);
            this._preview = this.$('.imageupload__preview').get(0);
        },

        render: function(json) {
            var that = this;
            this._preview.innerHTML = '';
            var img = new Image();
            var reader  = new FileReader();
            reader.addEventListener("load", function () {
                img.src = reader.result;
                that.trigger('created', { meta: json, file: that.getFile() });
                // that.renderFilter();
            }, false);
            this._preview.appendChild(img);
            reader.readAsDataURL(this.getFile());
            return this;
        },

        choose: function() {
            this._input.click();
        },

        getFile: function() {
            return this._input.files[0];
        },

        upload: function () {
            var that = this;
            var upload = new Upload(this.getFile());
            upload.save().then(function(json, response, options) {
                that.render(json);
            }, function(jqxhr, status, errorText) {
                alert(jqxhr.responseJSON.message);
            });
        }

    });

    return ImageUpload;
});
