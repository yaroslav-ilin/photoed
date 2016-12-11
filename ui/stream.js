define([
    'require',
    'backbone'
], function(require, Backbone) {
    'use strict';

    function Stream(addr) {
        _.extend(this, Backbone.Events);

        var that = this;
        this.addr = addr;
        var socket = this.socket = new WebSocket(addr);

        socket.onopen = function(e) {
            that.trigger('open', e);
        };
        socket.onmessage = function(e) {
            that.trigger('message', e);
            that.trigger('data', e.data);

            var message = null;
            try {
                message = JSON.parse(e.data);
                that.trigger(message.type, message.data);
            } catch(ignore) {}
        };
      
        socket.onclose = function(e) {
            that.trigger('close', e);
        };
        socket.onerror = function(e) {
            that.trigger('error', e);
        };
    }

    return Stream;
});
