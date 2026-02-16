
import express, { Router } from 'express'
// Add at top with other imports
import crypto from 'crypto';

import path from 'node:path'
import { readdir, mkdir, writeFile } from 'fs/promises';

import folderitems from '../folderdb.json' with {type: "json"}
import files from '../filesdb.json' with {type: "json"}

const router = express.Router();
const port = 4100;
//implemented the way to send the available file in main storage directory to server 
const basedir = path.resolve('./Storage')
const ispathsafe = (requrl) => {
    const cleanpath = path.normalize(requrl)
    const completepath = path.resolve(basedir, cleanpath)
    console.log(basedir, "requrl", cleanpath)
    return completepath.startsWith(basedir)
}
// router.get('/:id?', async (req, res, next) => {
//     const { id } = req.params
//     if (!id) {
//         //serving the first index as root always 
//         //we need to show the files and the fellow folders inside the root one 
//         //    console.log('fodleritem files',folderitems.files)
//         // console.log(files)
//         const folderdata = folderitems[0];
//         const filee = folderdata.filee.map((fileid) =>
//             files.find((id) =>//find is used to find the particular elements for the particular array and to return only the elements 
//                 fileid === id.id

//             )
//         )
//         console.log("test folderdata",folderdata)
//         const directories=folderdata.directories.map((fid)=>folderitems.find((dir)=>dir.did===fid));
// // console.log("founded directories",folder)
    
//         // console.log(folder)
//         // console.log(filee)
//         res.json({ ...folderdata, filee,directories })
//         // console.log("founded files",file)
//         //   console.log("founded files:",folderitems.files)

//     } else {
//         const folderitem = folderitems.find((folder) => folder.did == id)
//         console.log(folderitem)
//         if (!folderitem) {
//      return res.status(404).json({ message: "Folder not found", type: "error" });
//    }
//     //returning files and subdirectories for this folder 
//      const filee=folderitem.filee.map((fileid)=>files.find((file)=>file.id==fileid))||[]
// const directories=folderitem.directories.map((dirid)=>folderitems.find((folder)=>folder.did===dirid)) || [];
//  console.log({filee,directories})
//    res.json({ ...folderitem, filee, directories });  
//     }


// })

//for handling the folder creation request 

router.get('/:id?', async (req, res, next) => {
  console.log('hi fro mdirectories')
  const { id } = req.params;
  // console.log("cookies from get router:",req.cookies)
  // if (!userId) {
  //   return res.status(401).json({ error: 'Not authenticated' });
  // }
  if (!id) {
    // ROOT - works fine
    const folderdata = folderitems[0];
    const filee = folderdata.filee.map((fileid) =>
      files.find((file) => fileid === file.id)
    );
    const directories = folderdata.directories.map((fid) =>
      folderitems.find((dir) => dir.did === fid)
    );
    res.json({ ...folderdata, filee, directories });
  } else {
    const folderitem = folderitems.find((folder) => folder.did === id);
    if (!folderitem) {
      return res.status(404).json({ message: "Folder not found", type: "error" });
    }
    
    const filee = folderitem.filee?.map((fileid) =>
      files.find((file) => file.id === fileid)
    ) || [];
    
    // FIXED LINE ✅
  const directories=folderitem.directories.map((dirid)=>folderitems.find((folder)=>folder.did===dirid)) || [];
    
    console.log({filee, directories});  // Should show proper objects now
    res.json({ ...folderitem, filee, directories });
  }
});

router.post('/:parentdirid?', async (req, res) => {
    const parentdirid = req.params.parentdirid || folderitems[0].did//agar nahi hai to by default root hi hai to usi ka id le leneka
    const { foldername } = req.body
    //finding the parentdirQ
    const did = crypto.randomUUID()
   const parentdir= folderitems.find((dir) => dir.did === parentdirid || !parentdirid);
    if (!parentdir) {
    return res.status(404).json({ message: "Parent folder not found", type: "error" });
  }
    parentdir.directories.push(did)
    folderitems.push({
        did,
        name: foldername,
        parentdir: parentdir.name,
        filee:[],
        directories:[],
        // "createdAt": "2025-01-14T10:00:00Z",
        // "updatedAt": "2025-01-14T10:00:00Z",
        // "permissions": "rwxr-xr-x",
        // "owner": "system",
        // "size": 0,
    }
    )
    console.log({ did, foldername, parentdir, parentdirid })

    try {
        await writeFile('./folderdb.json', JSON.stringify(folderitems, null, '\t'))
        res.json({ message: `folder ${foldername} created succesfully`, type: "sucess" })
        // await mkdir(basefolderpath)
        console.log(`folder ${foldername} created succesfuly`)

      
    } catch (error) {
        console.log(error.message)
        res.status(505).json({ message: "error occured", type: "error" })
    }
})
router.patch('/:folderid',async(req,res,next)=>{
  const  id =req.params.folderid
  const {newfoldername}=req.body
  console.log({id,newfoldername})
  const findfolder=folderitems.findIndex((folder)=>folder.did==id);
  console.log(findfolder)
  const folderdetail=folderitems[findfolder]
  console.log("mil gaya ",folderdetail.name)
  try {
    folderdetail.name=newfoldername;
      await writeFile('./folderdb.json',JSON.stringify(folderitems,null,'\t'))
        res.json({message:`file ${folderdetail.name} file renamed sucessfully to ${newfoldername}`,type:"sucess"})
        console.log({message:`file ${folderdetail.name} file renamed sucessfully to ${newfoldername}`,type:"sucess"})
  } catch (error) {
    res.json({message:`error while renanming`,type: `error` })
    console.log(`error occured while renaming ${error.message}`)
  }
})
export default router