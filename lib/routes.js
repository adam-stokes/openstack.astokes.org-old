"use strict";

import Boom from "boom";
import Guides from "./guides";
import MD from "marked";

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
    method: 'GET',
    path: "/guides/{guide?}",
    config: {
        handler: (request, reply) => {
            let guide;
            if (request.params.guide) {
                if (Guides[request.params.guide]) {
                    guide = Guides[request.params.guide];
                } else {
                    return reply(Boom.notFound());
                }
            } else {
                guide = Guides['getting-started'];
            }
            let context = {
                guides: Guides,
                active: guide.title,
                html: MD(guide.contents)
            };
            reply.view("guide", context);
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
