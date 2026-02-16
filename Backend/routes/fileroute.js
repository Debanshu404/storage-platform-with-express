import express from 'express'
import multer from 'multer'
import path from 'node:path'
import { writeFile } from 'fs/promises';
import crypto from 'node:crypto';  // ✅ ADD THIS
import files from '../filesdb.json' with { type: "json" }
import folderitems from '../folderdb.json' with { type: "json" }
import { createWriteStream } from 'node:fs';

const router = express.Router();

// Multer config ✅ GOOD
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, './Storage'),
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

// ✅ UPLOAD ROUTE (Fixed)
router.post('/:filename',async(req,res)=>{
    const {filename}=req.params//body se file ka name le liya
   const parentdirId = req.headers['parentdirid'] || folderitems[0].did  //agar user root directory me hoga  then direct root ka id send kar denge coz first index will always be the root one
    console.log(parentdirId)
 
    const id=crypto.randomUUID()//random id
    const ext=path.extname(filename) //extension by path module
    const fullfilename=`${id}${ext}`
    // const fullpath=`${import.meta.dirname}/Storage/${decodedpath}` //old way without using the path module
    const decodedpath=decodeURIComponent(fullfilename)
    //new one using the path module
    const fullpath=path.join(import.meta.dirname,'../Storage',decodedpath)
    console.log(`${import.meta.dirname}/Storage/${filename}`)
    console.log("upload request received",fullpath)
 
        const writestream=createWriteStream(fullpath)
    //checking whether writestream has some error while writing  
   writestream.on('error',(err)=>{
    console.log(`error:${err.message}`)
    if(!res.headersSent){
    res.status(404).end("file uploading failed")
    }
   })
        writestream.on('finish',async ()=>{
            files.push({
                id,
                ext,
                name:filename, //name as filename
                parentdirId
            })
            //itna part will be for the folder files
       const parendtdirdata = folderitems.find((dir)=>dir.did===parentdirId);
if (!parendtdirdata) {  // ✅ Match variable name
  console.log("Parent folder not found:", parentdirId);
  return res.status(404).end("Parent folder not found");
}
parendtdirdata.filee.push(id);  // ✅ Now works
//id is the random id of the file
           
            //itna part is for the file
            await writeFile('./filesdb.json',JSON.stringify(files,null,'\t'))
            await writeFile('./folderdb.json',JSON.stringify(folderitems,null,'\t'))
            res.status(200).end("file uploaded sucessfully")
            console.log(`file ${filename} uploaded succesfully `)
    })
    req.on('error',(err)=>{
        console.log(`error occured on requst ${err.message}`)
    })
         req.pipe(writestream)
     
   
})
// this is my post route

// ✅ FIXED GET ROUTE
router.get('/:usrid',(req,res,next)=>{
    const {usrid}=req.params;
    console.log(usrid)
   const reqfile=files.find((item)=>item.id===usrid);
   console.log(reqfile)
    // const fullpath=`${import.meta.dirname}/Storage/${filepath}`//old way
    const fullpath=path.join(import.meta.dirname,'../Storage',`${reqfile.id}${reqfile.ext}`)
    console.log("fullpath",fullpath)
    // const fullpath=path.join(import.meta.dirname,'../Storage',decodedpath)
if(req.query.action=='download'){
    res.set("Content-Disposition",`attachment; filename=${reqfile.name}`)
    console.log(`file ${reqfile.name} downloaded sucesfully`)
}else {
   
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(fullpath)}"`);
  }


    res.sendFile(fullpath,(err)=>{
        if(err){
            console.log("error occured:",err.message)
            res.status(500).end("File not found")
        }
    })
    const {query,params}=req
    // console.log(`query:${query},params:${params}`)
    // console.log(query.action,params)
})
//rename and delete route to be added 
export default router;
