import { createReadStream, createWriteStream } from "node:fs";
import { open, readdir ,readFile,rm,rename} from "node:fs/promises";
import http from "node:http";
import * as mime from 'mime-types';



const server=http.createServer(async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    console.log(req.method)
    const [url,method]=req.url.split('?')
  if(req.method=="GET"){
      if(url==='/favicon.ico') return res.end(`no favicon`)
    if(url==='/'){
     await servefile(req,res,url)
    }else{
        try {
            console.log(url)
            const filehandle=await open(`../Storage${decodeURIComponent(url)}`)
            const directory=await filehandle.stat()
            //implementing the logic to get the method
            //here method is the query papram
            const queryparam={}
            method?.split('&').forEach((item)=>{
    const[key,value]=item.split("=") 
    queryparam[key]=value}  )
    console.log(url,queryparam)
     

            if(directory.isDirectory()){
               await servefile(req,res,url);
            }else{

                const readstream=filehandle.createReadStream()
                const filename = url?.split('/').pop(); // Extracts just the filename
res.setHeader("content-type", mime.contentType(filename))


              
                res.setHeader('Content-length',directory.size)
                
                // console.log(queryparam.action)
                if(queryparam.action==='download'){
                    
                    res.setHeader('Content-Disposition', `attachment; filename="${url.slice(1)}"`);
                }
 const mimeType = mime.contentType(url.split('/').pop())
console.log('MIME type:', mimeType)

console.log('File extension:', url.slice(1))
                readstream.pipe(res)
            }
        } catch (error) {
            console.log(error.message)
            res.end("file not found")
        }
    }
  }else if(req.method=="OPTIONS")  { res.end("ok")}
    else if(req.method=="POST"){
        const headers=req.headers
        const writestream=createWriteStream(`../Storage/${headers.filename}`)
        req.on('data',(chunk)=>{
            // console.log(chunk.toString())
            writestream.write(chunk)
         
        })
    }else if(req.method=='DELETE'){
        req.on('data',async(chunk)=>{
          const filename=chunk.toString()
          console.log(filename)
           if(filename){
            try {
                
                await rm(`../Storage/${filename}`)
                res.end(`Deleted File${filename}`)
            } catch (error) {
                res.end(`error from server ${error.message}`)
            }
           }
        })
    }else if (req.method=='PATCH'){
        req.on('data',async (chunk)=>{
            const data=JSON.parse(chunk.toString())
   try {
  await rename(`../Storage/${data.oldfile}`, `../Storage/${data.rename}`);
  console.log("Rename successful");
} catch (err) {
  console.error("Rename failed:", err);
}
console.log(data)
        })
        res.end("Rename suceesfully completed")
    }
   
})
async function servefile(req,res,url) {
     
     const files = await readdir(`../Storage${decodeURIComponent(url)}`);

      
       res.setHeader('Content-type','application/json')
        res.end(JSON.stringify(files))
} 
server.listen(4000,'192.168.29.249',()=>{
    console.log("running on 4100")
})