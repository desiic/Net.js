/**
 * JS lang utils
 */ 
class js {

    /**
     * New async lock (not thread lock)
     */ 
    static new_lock(){
        var unlock,Lock = new Promise((res,rej)=>{ unlock=res; });
        return [Lock,unlock];
    }

    /**
     * Stay idle for a number of ms (not blocking thread aka sleep)
     */ 
    static async stay_idle(ms){
        var [Lock,unlock] = js.new_lock();
        setTimeout(()=>{
            unlock();
        },ms);
        await Lock;
    }
}

export default js;
// EOF