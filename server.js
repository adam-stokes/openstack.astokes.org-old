"use strict";
var Hapi = require("hapi");
var Good = require("good");
var config = require("./config");
var server = new Hapi.Server();
var Yar = require("yar");

server.connection({
    port: config.port
});

var yarOpts = {
    cookieOptions: {
        password: config.secret,
        clearInvalid: true,
        isSecure: false
    }
};

server.register({
    register: Yar,
    options: yarOpts
}, function(err) {
    if (err) {
        throw Error(err);
    }
});

server.views({
    engines: {
        jade: require("jade")
    },
    relativeTo: __dirname,
    path: "./templates",
    context: {
        site: config
    }
});

server.route({
    path: "/favicon.ico",
    method: "GET",
    handler: {
        file: "./favicon.ico"
    }
});

server.route({
    path: "/",
    method: "GET",
    handler: function(request, reply) {
        return reply.view("index");
    }
});

server.route({
    path: "/static/{path*}",
    method: "GET",
    handler: {
        directory: {
            path: "./public",
            listing: false,
            index: false
        }
    }
});

server.register({
    register: Good,
    options: {
        reporters: [{
            reporter: require("good-console"),
            events: {
                response: "*",
                log: "*"
            }
        }]
    }
}, function(err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function() {
        server.log("info", "Server running at: " + server.info.uri);
    });
});
