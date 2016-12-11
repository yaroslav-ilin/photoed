define(['require', 'backbone', 'stream', 'presets'], function(require, Backbone, Stream, presets) {
    'use strict';

    var WatchModel = Backbone.Model.extend({
        urlRoot: '/api/images',

        type: 'preset',
        presetId: 'normal',

        initialize: function(opts) {
            var that = this;
            var streamAddr = 'ws://' + location.host + '?watch=' + this.id;
            var stream = this.stream = new Stream(streamAddr);

            stream.on('preset', function(preset) {
                that.set(preset);
            });
            this.fetch().then(function(data) {
                var img = new Image();
                img.src = data.url;
                that.set('image', img);
            });
        }
    });

    var Watch = Backbone.View.extend({
        initialize: function(opts) {
            this.model = new WatchModel({ id: opts.id });
            this.model.on('change:image', this._onImageChange, this);
            this.model.on('change:presetId', this._onPresetIdChange, this);

            try {
                var canvas = fx.canvas();
            } catch (err) {
                alert(err);
                return;
            }
        },
        _onImageChange: function() {
            if (this._img) {
                this.el.removeChild(this._img);
            }
            this._img = new Image();
            this._img.src = this.model.get('image').src;
            this.el.appendChild(this._img);
        },
        _onPresetIdChange: function() {
            var presetId = this.model.get('presetId');
            var preset = null;
            presets.some(function(item) {
                if (item.id === presetId) {
                    preset = item;
                    return true;
                }
                return false;
            });
            if (!preset) {
                return;
            }

            var canvas  = fx.canvas();
            canvas
                .draw(canvas.texture(this.model.get('image')))
                .brightnessContrast(preset.filter.brightness, preset.filter.contrast)
                .hueSaturation(preset.filter.hue, preset.filter.saturation)
                .vibrance(preset.filter.vibrance)
                .denoise(preset.filter.denoise * 100)
                .unsharpMask(preset.filter.radius * 100, preset.filter.strength)
                .noise(preset.filter.noise)
                .sepia(preset.filter.sepia)
                .vignette(preset.filter.size, preset.filter.amount)
                .update();

            this._img.src = canvas.toDataURL('image/png');
        }
    });

    return Watch;
});
