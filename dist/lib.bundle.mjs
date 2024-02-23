import{createRequire as e}from"module";var t={d:(e,r)=>{for(var s in r)t.o(r,s)&&!t.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:r[s]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)},r={};t.d(r,{Z:()=>h});class s{static new_lock(){var e;return[new Promise(((t,r)=>{e=t})),e]}static async stay_idle(e){var[t,r]=s.new_lock();setTimeout((()=>{r()}),e),await t}}const n=s,o=console.log,i=n.new_lock,l=e(import.meta.url)("fs"),a=e(import.meta.url)("http"),d=console.log;console.warn,console.error;const h={js:n,base_handler:class{Allowed_Origins=null;constructor(){this.Allowed_Origins=process.Server.Config.Allowed_Origins}get_origin(e){return null!=e.headers.origin?e.headers.origin:e.headers.Origin}allow_cors_all(e,t){t.setHeader("Access-Control-Allow-Origin","*"),t.setHeader("Access-Control-Allow-Methods","*"),t.setHeader("Access-Control-Allow-Headers","*")}allow_cors_some(e,t,r){var s=this.get_origin(e).toLowerCase().trim();-1!=r.indexOf(s)&&(t.setHeader("Access-Control-Allow-Origin",s),t.setHeader("Access-Control-Allow-Methods","*"),t.setHeader("Access-Control-Allow-Headers","*"))}async get_body(e){var[t,r]=i(),s=[];return e.on("error",(e=>{o(e);let t=Buffer.concat(s).toString();r(t)})),e.on("data",(e=>{s.push(e)})),e.on("end",(()=>{let e=Buffer.concat(s).toString();r(e)})),await t}async get_body_obj(e){var t=await this.get_body(e);return JSON.parse(t)}end(e){e.end()}send(e,t,r){e.setHeader("Content-Type",r),e.end(t)}send_text(e,t){this.send(e,t,"text/plain")}send_html(e,t){this.send(e,t,"text/html")}send_json(e,t){this.send(e,JSON.stringify(t),"application/json")}handle_cors(e,t){t.end("")}async handle_get(e,t){}async handle_post(e,t){}},base_server:class{Cwd=process.cwd();Env_Name=null;Config=null;port=null;Http_Server=null;Http2_Server=null;Handlers_Dir=null;Ws_Handlers_Dir=null;constructor(e,t="handlers",r="ws-handlers"){this.Env_Name=process.env.Envname,this.Config_File=e,this.Handlers_Dir=t,this.Ws_Handlers_Dir=r,this.handle_request=this.handle_request.bind(this)}async process_request(e,t,r){d("Handler file:",r);try{var s=new(0,(await import(r)).default)}catch(r){return d(r),d(`No handler for ${e.method} ${e.url}`),void t.end(`No handler for ${e.method} ${e.url}`)}s.Server=this,"OPTIONS"==e.method?s.handle_cors(e,t):"GET"==e.method?s.handle_get(e,t):"POST"==e.method?s.handle_post(e,t):(d(`Method ${e.method} is not supported.`),t.end())}send_favicon(e,t){t.end()}handle_request(e,t){d(`\n${e.method} ${e.url}`);var r=e.url,s=r.split("/").filter((e=>e.trim().length>0));if("/"!=r.trim())if("/favicon.ico"!=r.trim().toLowerCase()){if(0==s.length)return d("Bad request, empty path."),void t.end();"/"==r.charAt(0)&&(r=r.slice(1)),this.process_request(e,t,`${this.Cwd}/${this.Handlers_Dir}/${r}.mjs`)}else this.send_favicon(e,t);else this.process_request(e,t,`${this.Cwd}/${this.Handlers_Dir}/root.mjs`)}async init(){d("Env:",this.Env_Name);var e=`${process.cwd()}/${this.Config_File}`,t=await l.promises.readFile(e),r=JSON.parse(t);d("Config:",JSON.stringify(r,null,4)),this.Config=r,this.port=r.Ports[this.Env_Name],d("Port:",this.port)}start(){var e=a.createServer(this.handle_request);this.Http_Server=e,this.Http_Server.listen(this.port),d(`Server listening at port ${this.port}...`)}},base_ws_handler:{}};var c=r.Z;export{c as default};