// Libs
import fs   from "fs";
import http from "http";

// Modules
import js from "../core/js.mjs";

// Shorthands
const log  = console.log;
const logw = console.warn;
const loge = console.error;

/**
 * Base server
 */ 
class base_server {
    Env_Name = null;
    port     = null;

    /**
     * Ctor
     */ 
    constructor(Config_File){
        this.Env_Name    = process.env.Envname;
        this.Config_File = Config_File;        
    }

    /**
     * Init
     */ 
    async init(){
        log("Envmnt:",this.Env_Name);
        
        // Load config
        var Cwd         = process.cwd();
        var Config_Path = `${Cwd}/${this.Config_File}`;
        var Json        = await fs.promises.readFile(Config_Path);
        var Config      = JSON.parse(Json);
        log("Config:",Config);

        // Set port
        this.port = Config.Ports[this.Env_Name];
        log("Port:\x20\x20",this.port);
    }

    /**
     * Start
     */ 
    async start(){
    }
}

export default base_server;
// EOF