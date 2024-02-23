const path = require("path");

module.exports = {
    target: "node",
    entry: {
        lib: "./src/lib.mjs"
    },
    mode: "production",
    output: {
        path: `${__dirname}/dist`,
        filename: "[name].bundle.mjs",
        library: {
            type: "module"
        },
        chunkFormat: "module"        
    },
    experiments: {
        outputModule: true
    },
    module: {
        parser: {
            javascript: {
                importMeta: false
            }
        }
    },
    plugins: [],
    resolve:{
        modules: [
            path.resolve(__dirname,"src")
        ],
        alias: {
            // Don't use this alias, dev env loads file dynamically thru'
            // browser root path after domain:
            "~": path.resolve(__dirname,"src")
        }
    },
    optimization: {
		minimize: true
	}
};
// EOF