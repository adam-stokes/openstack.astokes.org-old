"use strict";

import Boom from "boom";

let routes = [];

routes.push({
    path: "/",
    method: "GET",
    config: {
        handler: (request, reply) => {
            return reply.view("index");
        }
    }
});

routes.push({
    path: "/static/{path*}",
    method: "GET",
    config: {
        handler: {
            directory: {
                path: "./public",
                index: false,
                redirectToSlash: false
            }
        }
    }
});

routes.push({
    path: "/favicon.ico",
    method: "GET",
    config: {
        handler: {
            file: "./favicon.ico"
        }
    }
});


export default routes;
