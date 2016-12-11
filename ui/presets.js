define(['backbone'], function(Backbone) {
    var presets = [{
        name  : 'Normal',
        id    : 'normal',
        filter: {
            brightness: 0,
            contrast  : 0,
            hue       : 0,
            denoise   : 20,
            saturation: 0,
            vibrance  : 0,
            radius    : 0,
            strength  : 0,
            noise     : 0,
            sepia     : 0,
            size      : 0,
            amount    : 0,
        }
    }, {
        name  : 'Claredon',
        id    : 'claredon',
        filter: {
            brightness: 0.3,
            contrast  : 0,
            hue       : 0,
            denoise   : 20,
            saturation: 0,
            vibrance  : 0,
            radius    : 0,
            strength  : 0,
            noise     : 0,
            sepia     : 0,
            size      : 0,
            amount    : 0,
        }
    }, {
        name  : 'Gingham',
        id    : 'gingham',
        filter: {
            brightness: 0,
            contrast  : 0.5,
            hue       : 0,
            denoise   : 20,
            saturation: 0.1,
            vibrance  : 0.3,
            radius    : 0,
            strength  : 0,
            noise     : 0,
            sepia     : 0,
            size      : 0,
            amount    : 0.3,
        }
    }, {
        name  : 'Moon',
        id    : 'moon',
        filter: {
            brightness: 0,
            contrast  : 0,
            hue       : 0,
            denoise   : 20,
            saturation: -1,
            vibrance  : 0,
            radius    : 0,
            strength  : 0,
            noise     : 0,
            sepia     : 0,
            size      : 0,
            amount    : 0.8,
        }
    }, {
        name  : 'Lark',
        id    : 'lark',
        filter: {
            brightness: 0,
            contrast  : 0,
            hue       : 0,
            denoise   : 20,
            saturation: 0,
            vibrance  : -0.3,
            radius    : 0.2,
            strength  : 0,
            noise     : 0,
            sepia     : 0,
            size      : 0,
            amount    : 0,
        }
    }];

    return presets;
});
