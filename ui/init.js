var photoed = (function(window) {
    function loadComponents() {
        require(['presets', 'router'], function(presets, router) {

            try {
                var canvas  = fx.canvas();
            } catch (err) {
                alert(err);
                return;
            }
/*
            var image = document.getElementById('demo');
            var thumbnails = presets.map(function(preset) {
                var filterThumb = new Image();
                var img = new Image();
                img.src = image.src;
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
                filterThumb.src = canvas.toDataURL('image/jpeg', 0.7);
                return {
                    id: preset.id,
                    name: preset.name,
                    thumbnail: filterThumb
                };
            });

            thumbnails.forEach(function(thumb) {
                document.body.appendChild(thumb.thumbnail);
                var description = document.createElement('span');
                description.textContent = thumb.name;
                document.body.appendChild(description);
            });
*/
        });
    }

    return {
        initialize: function photoed__init(backbone) {
            loadComponents();
        }
    };
}(this));

require(['backbone'], photoed.initialize);
