define(['require', 'backbone', 'image_upload', 'presets'], function(require, Backbone, ImageUpload, presets) {
    'use strict';

    var PresetPreview = Backbone.View.extend({
        tagName: 'li',

        template: _.template($('#toolbar-preset-item').html()),
        preset: null,

        initialize: function(opts) {
            this.preset = opts.preset;
        },

        render: function(file, cb) {
            var that = this;
            var preset = this.preset;
            this.$el.addClass('hidden').html(this.template(preset));

            var reader  = new FileReader();
            reader.addEventListener("load", function () {
                var img = new Image();
                img.src = reader.result;
                var canvas  = fx.canvas();
                canvas
                    .draw(canvas.texture(img))
                    .brightnessContrast(preset.filter.brightness, preset.filter.contrast)
                    .hueSaturation(preset.filter.hue, preset.filter.saturation)
                    .vibrance(preset.filter.vibrance)
                    .denoise(preset.filter.denoise * 100)
                    .unsharpMask(preset.filter.radius * 100, preset.filter.strength)
                    .noise(preset.filter.noise)
                    .sepia(preset.filter.sepia)
                    .vignette(preset.filter.size, preset.filter.amount)
                    .update();

                img.src = canvas.toDataURL('image/png');
                that.$('.preset-preview').prepend(img);
                cb(that.$el);
                that.$el.removeClass('hidden');
            }, false);
            reader.readAsDataURL(file);
        }
    });

    var Toolbar = Backbone.View.extend({
        events: {
            'click .toolbar__presets li': 'changePreset'
        },

        render: function(file) {
            var that = this;
            var presetsCopy = presets.slice();
            var container = that.$('.toolbar__presets');

            function renderNextPreview($el) {
                if ($el) {
                    container.append($el);
                }
                if (0 === presetsCopy.length) {
                    that.$el.removeClass('toolbar_loading_yes');
                    return;
                }
                var preset = presetsCopy.shift();
                var p = new PresetPreview({
                    id: 'preset_' + preset.id,
                    preset: preset
                });
                p.render(file, renderNextPreview);
            }

            this.$el.addClass('toolbar_loading_yes');
            container.html('');
            renderNextPreview();
            return this;
        },

        show: function() {
            this.$el.removeClass('hidden');
            return this;
        },
        hide: function() {
            this.$el.addClass('hidden');
            return this;
        },
        changePreset: function(e) {
            console.log('changePreset');
        }
    });

    var ShareLink = Backbone.View.extend({
        render: function(id) {
            var link = location.origin + '/watch/' + id;
            this.$el.html(link);
            this.$el.attr('href', link);
            return this;
        }
    });

    var Home = Backbone.View.extend({
        _imageUpload: null,
        _toolbar: null,
        _share: null,

        initialize: function() {
            this._toolbar = new Toolbar({ el: this.$('.toolbar') });
            this._share = new ShareLink({ el: this.$('.share .share__link') });
            this._imageUpload = new ImageUpload({ $el: this.$('.imageupload') });
            this._imageUpload.on('created', this._onCreated, this);
        },

        _onCreated: function(data) {
            this._share.render(data.meta.upload_id);
            this._toolbar.render(data.file).show();
        }
    });

    return Home;
});
