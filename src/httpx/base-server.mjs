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
    Cwd             = process.cwd();
    Env_Name        = null;
    Config          = null;
    port            = null;
    Http_Server     = null;
    Http2_Server    = null; // Unused, Chromium-based accepts HTTP2 secure only?
    Handlers_Dir    = null;
    Ws_Handlers_Dir = null;

    /**
     * Ctor, config file and handlers dirs have paths starting from current working dir.
     */ 
    constructor(Config_File,Handlers_Dir="handlers",Ws_Handlers_Dir="ws-handlers"){ 
        this.Env_Name        = process.env.Envname;
        this.Config_File     = Config_File;        
        this.Handlers_Dir    = Handlers_Dir;
        this.Ws_Handlers_Dir = Ws_Handlers_Dir;

        // Scope
        this.handle_request = this.handle_request.bind(this);
    }

    /**
     * Process request 
     */ 
    async process_request(Req,Res,Handler_File){
        log("Handler file:",Handler_File);
        try{
            const Handler_Class = (await import(Handler_File)).default;
            var   Handler       = new Handler_Class();
        }
        catch(Err){
            log(Err);
            log(`No handler for ${Req.method} ${Req.url}`);
            Res.end(`No handler for ${Req.method} ${Req.url}`);
            return;
        }
        
        if (Req.method=="OPTIONS")
            Handler.handle_cors(Req,Res);
        else
        if (Req.method=="GET")
            Handler.handle_get(Req,Res);
        else
        if (Req.method=="POST")
            Handler.handle_post(Req,Res);
        else{
            log(`Method ${Req.method} is not supported.`);
            Res.end();
        }
    }

    /**
     * Send favicon.ico
     */ 
    send_favicon(Req,Res){
        Res.end();
    }

    /**
     * Handle request
     */
    handle_request(Req,Res){ // Req:IncomingMessage, Res:ServerResponse
        log(`\n${Req.method} ${Req.url}`);
        var Path   = Req.url;
        var Tokens = Path.split("/").filter(X => X.trim().length>0);

        // Root
        if (Path.trim()=="/"){
            this.process_request(Req,Res, `${this.Cwd}/${this.Handlers_Dir}/root.mjs`);
            return;
        }

        // Favicon
        if (Path.trim().toLowerCase()=="/favicon.ico"){
            this.send_favicon(Req,Res);
            return;
        }

        // Bad request
        if (Tokens.length==0){
            log("Bad request, empty path.");
            Res.end();
            return;
        }

        // Normal request
        if (Path.charAt(0)=="/") Path=Path.slice(1);
        this.process_request(Req,Res, `${this.Cwd}/${this.Handlers_Dir}/${Path}.mjs`);
    }

    /**
     * Init
     */ 
    async init(){
        log("Env:",this.Env_Name);
        
        // Load config
        var Cwd         = process.cwd();
        var Config_Path = `${Cwd}/${this.Config_File}`;
        var Json        = await fs.promises.readFile(Config_Path);
        var Config      = JSON.parse(Json);
        log("Config:",JSON.stringify(Config,null,4));
        this.Config = Config;

        // Set port
        this.port = Config.Ports[this.Env_Name];
        log("Port:",this.port);
    }

    /**
     * Start
     */ 
    start(){
        var Http_Server  = http.createServer(this.handle_request);        
        this.Http_Server = Http_Server;

        // Start listening
        this.Http_Server.listen(this.port);
        log(`Server listening at port ${this.port}...`);
    }
}

export default base_server;
// EOF