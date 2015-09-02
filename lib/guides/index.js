"use strict";

import Fs from "fs";
import Path from "path";

let items = {
    "getting-started": {
        title: "Getting Started",
        slug: "getting-started",
        contents: Fs.readFileSync(Path.join(__dirname, "getting-started.md"), "utf8")
    },
    "single-install": {
        title: "Single Install Guide",
        slug: "single-install",
        contents: Fs.readFileSync(Path.join(__dirname, "single-install.md"), "utf8")
    },
    "multi-install": {
        title: "Multi Install Guide",
        slug: "multi-install",
        contents: Fs.readFileSync(Path.join(__dirname, "multi-install.md"), "utf8")
    },
    "developer-setup": {
        title: "Developer Setup Guide",
        slug: "developer-setup",
        contents: Fs.readFileSync(Path.join(__dirname, "developer-setup.md"), "utf8")
    },
    "using-juju": {
        title: "Using Juju in OpenStack",
        slug: "using-juju",
        contents: Fs.readFileSync(Path.join(__dirname, "using-juju.md"), "utf8")
    },
    "testing": {
        title: "Testing Guide",
        slug: "testing",
        contents: Fs.readFileSync(Path.join(__dirname, "testing.md"), "utf8")
    }
};

export default items;
