define([
    'require',
    'backbone',
    'home',
    'watch'
], function(require, Backbone, Home, Watch) {
    'use strict';
    function hideAllControllers() {
        [].forEach.call(document.querySelectorAll('.controller'), function(div) {
            div.classList.add('hidden');
        });
    }

    var Router = Backbone.Router.extend({
        _currentController: null,

        routes: {
            'publish': 'publish',
            'watch/:id': 'watch'
        },

        publish: function() {
            hideAllControllers();
            var controller = document.getElementById('controllers__home');
            controller.classList.remove('hidden');
            this._currentController = new Home({ el: controller }).render();
        },
        watch: function(watchId) {
            hideAllControllers();
            var controller = document.getElementById('controllers__watch');
            controller.classList.remove('hidden');

            console.log('watch', watchId);
            var watch = new Watch({ id: watchId });
            controller.appendChild(watch.el);
        }
    });

    var router = new Router();
    Backbone.history.start({ pushState: true });
    return router;
});
