var photoed = (function(window) {
    function loadComponents() {
        require(['image_upload'], function(ImageUpload) {
            photoed.ImageUpload = ImageUpload;
            console.log('image', new ImageUpload);
        });
    }

    return {
        initialize: function photoed__init(backbone) {
            loadComponents();
        }
    };
}(this));

require(['backbone'], photoed.initialize);
