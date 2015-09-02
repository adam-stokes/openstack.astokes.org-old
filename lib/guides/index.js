"use strict";

import Fs from "fs";
import Path from "path";

export var single = {
    title: "Single Install Guide",
    contents: Fs.readFileSync(Path.join(__dirname, "single.install.md"), "utf8")
};
