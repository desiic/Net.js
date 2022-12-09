// Modules
import js from "../core/js.mjs";

// Shorthands
const log      = console.log;
const new_lock = js.new_lock;

/**
 * Base HTTP handler
 */ 
class base_handler {
    Allowed_Origins = null;

    /**
     * Ctor
     */ 
    constructor(){
        this.Allowed_Origins = process.Server.Config.Allowed_Origins;
    }

    /**
     * Get origin
     */ 
    get_origin(Req){
        if (Req.headers.origin != null) return Req.headers.origin;
        return Req.headers.Origin;
    }

    /**
     * Allow CORS (allow accessing from other domains)
     */ 
    allow_cors_all(Req,Res){
        Res.setHeader("Access-Control-Allow-Origin",  "*");        
        Res.setHeader("Access-Control-Allow-Methods", "*");
        Res.setHeader("Access-Control-Allow-Headers", "*");
    }

    /**
     * Allow CORS for some origins
     */ 
    allow_cors_some(Req,Res,Origins){
        var Origin = this.get_origin(Req).toLowerCase().trim();
        if (Origins.indexOf(Origin) == -1) return; // Not to allow

        // Allow
        Res.setHeader("Access-Control-Allow-Origin",  Origin);        
        Res.setHeader("Access-Control-Allow-Methods", "*");
        Res.setHeader("Access-Control-Allow-Headers", "*");
    }

    /**
     * Get body, 
     * Ref: https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
     */ 
    async get_body(Req){
        var [Lock,unlock] = new_lock();
        var Buf_Chunks    = [];

        Req.on("error", Err=>{
            log(Err);
            let Body = Buffer.concat(Buf_Chunks).toString();
            unlock(Body);
        });
        Req.on("data", Chunk=>{
            Buf_Chunks.push(Chunk);
        });
        Req.on("end", ()=>{
            let Body = Buffer.concat(Buf_Chunks).toString();
            unlock(Body);
        });

        var Body = await Lock;
        return Body;
    }

    /**
     * Get body as object
     */ 
    async get_body_obj(Req){
        var Body = await this.get_body(Req);
        return JSON.parse(Body);
    }

    /**
     * End
     */ 
    end(Res){
        Res.end();
    }

    /**
     * Send
     */ 
    send(Res,Value_Str,Content_Type){
        Res.setHeader("Content-Type", Content_Type);
        Res.end(Value_Str);
    }

    /**
     * Send text
     */ 
    send_text(Res,Text){
        this.send(Res,Text,"text/plain");
    }

    /**
     * Send HTML
     */ 
    send_html(Res,Html){
        this.send(Res,Html,"text/html");
    }

    /**
     * Send object
     */ 
    send_json(Res,Obj){
        this.send(Res,JSON.stringify(Obj),"application/json");
    }

    /**
     * Process OPTIONS
     */ 
    handle_cors(Req,Res){
        Res.end(""); // No header to respond, no CORS by default
    }

    /**
     * Process GET
     */ 
    async handle_get(Req,Res){
        // To override
    }

    /**
     * Process POST
     */ 
    async handle_post(Req,Res){
        // To override
    }
}

export default base_handler;
// EOF