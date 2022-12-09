/**
 * Base HTTP handler
 */ 
class base_handler {

    /**
     * Process GET
     */ 
    static handle_get(Req,Res){
        // To override
    }

    /**
     * Process POST
     */ 
    static handle_post(Req,Res){
        // To override
    }
}

export default base_handler;
// EOF