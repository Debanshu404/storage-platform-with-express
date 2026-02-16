import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const DirectoryView = () => {
  const navigate = useNavigate();
  const [ok, setok] = useState(false);
  const [progress, setprogress] = useState(0);
  const [loading, setloading] = useState(false);
  const [toast, settoast] = useState({ message: "", type: "" });
  //file list
  const [filedata, setfiledata] = useState([]);
  const [fileslist, setfileslist] = useState([]);
  //folder lists
  const [directorylist, setdirectorylist] = useState([]);
  const [currentpath, setcurrentpath] = useState([]);
  // renamefile will be used in the tracking of the file whihc is being renamed recently
  //for renaming the file
  const [newname, setnewname] = useState("");
  const [renamefile, setrenamefile] = useState("");
  //for renaming the folders
  const [folderRenameId, setFolderRenameId] = useState("");
const [folderNewName, setFolderNewName] = useState("");



  const [showfodlerinput, setshowfolderinput] = useState(false);
  const [foldername, setfoldername] = useState("");


  const { "*": dir } = useParams();
const Base_url = "http://localhost:4100";
//upload funtionality
  async function handelfile(e) {
     console.log("comign from the handlefile",e.target.files)
    const file = e.target?.files?.[0];
    if (!file) return;
    setloading(true);
    const filename = file.name.trim();
       const uploadPath =currentpath ? `${currentpath}/${filename}` : filename
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${Base_url}/files/${file.name}`, "true");
  xhr.setRequestHeader('parentdirid', currentpath || '');
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        let kitna = Math.floor((event.loaded / event.total) * 100);
        setprogress(kitna);
      }
    });


    xhr.addEventListener("load", () => {
      setloading(false);
      setprogress(0);
      settoast({
        message: `${xhr.responseText}` || "Uploaded",
        type: "sucess",
      });
      setTimeout(() => settoast({ message: "", type: "" }), 3000);
      getfiles(currentpath);
    });


    xhr.addEventListener("error", (err) => {
      settoast({ message: `${err.message}` || "Error occured", type: "error" });
    });


    xhr.send(file);
  }


  async function handledelete(id,isfolder) {
    console.log("from handledelte",id)
    const ans = confirm(
      "do you want to transfer to recycle bin or permanently delte ok for recycle no for permanent delete"
    );
    if (ans) {
      handletrash();
      settoast({ message: "file moved to trash succesfully", type: "success" });
      setTimeout(() => {
        settoast("");
      }, 4000);
    } else {
      const confirmation = confirm(
        `you sure you want to delete file,this process cant be undon`
      );
      if (confirmation) {
        handlerealdelete(id);
      }
    }
  }


  async function handlerealdelete(id) {
 
 
 
    const res = await fetch(`${Base_url}/files/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    settoast({ message: `${data.message}`, type: `${data.type}` });
    setTimeout(() => {
      settoast("");
    }, 4000);
    getfiles(currentpath);
  }


  async function handlenewname(name) {
    setnewname(name);
    setrenamefile(name);
  }


  async function handelrename(id) {
console.log(`oldfilename ${renamefile} and newfilename ${newname}`)
   
   
    // const oldpath = currentpath ? `${currentpath}/${oldfile}` : oldfile;
   
   
    // const newpath = currentpath ? `${currentpath}/${newname}` : newname;
   
    // console.log("Old path:", oldpath);
    // console.log("New path:", newpath);
   
    const res = await fetch(`${Base_url}/files/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({newfilename:newname}),
    });
    const data = await res.json();
    settoast({ message: `${data.message}`, type: `${data.type}` });
    setnewname("");
    setrenamefile("");
    getfiles(currentpath);
    setTimeout(() => {
      settoast("");
    }, 4000);
  }


  async function handletrash() {
   
    const res = await fetch(`${Base_url}/files/trash`, {
      method: "POST",
    });
    const data = await res.text();


    // if (data) {
    //   navigate(`${Base_url}/trash`);
    // }
 
    alert("Coming soon......")
  }
//opening a folder
  async function handleDirectory(id) {
    //finding the folder from the id given from the user click or simple pass'folder'
    console.log(directorylist,id)
    const folder=directorylist.find((dir)=>dir.did==id)
    const foldername=folder.did
    console.log("this is the founded directory from the user click",folder)
    // const newpath = currentpath ? `${currentpath}/${foldername}` : foldername;
    // console.log(newpath);
   



     navigate(`/${foldername}`);
  }


  //create  a file at / or at nested urls
  function folderinputfunction() {
    setshowfolderinput(true);
    // console.log(showfodlerinput)


  }
  //creation of folder
  async function handlecreatefolder() {
    console.log("folderpath", `${currentpath}`);
    console.log(showfodlerinput,",",currentpath)
    const res=await fetch(`${Base_url}/directory/${currentpath}`,{
      headers: { "Content-Type": "application/json" },
      method:"POST",
       body: JSON.stringify({foldername: foldername || "untitled"})
    })
    const data=await res.json()
    console.log(`${data.message}`)
    // console.log(foldername||"untilted");
    // console.log(showfodlerinput)
     settoast({ message: `${data.message}`, type: `${data.type}` });


     setshowfolderinput(false)
     setfoldername("")
     getfiles(currentpath);
    setTimeout(() => {
      settoast("");
    }, 4000);
   
   
  }
  //renaming a folder
  async function handlefolderrename(id) {
     const res = await fetch(`${Base_url}/directory/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({newfoldername:folderNewName}),
    });
    const data = await res.json();
    settoast({ message: `${data.message}`, type: `${data.type}` });
    console.log(folderNewName,id)
    setFolderNewName("")
    setFolderRenameId("")
    // console.log(currentpath)
    getfiles(currentpath)
  }
  //handleback function
// function handleBack(){
//   console.log("back")
//   const parts=currentpath.split("/")
//   parts.pop()
//   const finalone=parts.join('/')
//   navigate(finalone?`/${finalone}`:'/')
// }
function handleBack(){
  if (currentpath.includes('/')) {
    // Has parent path
    const parts = currentpath.split("/");
    parts.pop();
    const parentPath = parts.join('/');
    navigate(parentPath ? `/${parentPath}` : '/');
  } else {
    // Direct child of root
    navigate('/');
  }
  getfiles('');  // Always go to root contents
}


//to get the files from the root or any other directory
  async function getfiles(path = "") {
    console.log("path", `${path}`);
    // console.log(`${filedata.}`)
    console.log(path||"empty")
    const datas=await fetch(path?`${Base_url}/directory/${path}`:`${Base_url}/directory`,{
      credentials: "include", 
    })
    console.log(datas)
    const res = await datas.json();
    console.log("value of res",res);
    setfileslist(res.filee)            
    setdirectorylist(res.directories)    
    console.log("fileslist",res.filee)        
    console.log("directorylist",res.directories)        
  }


  useEffect(() => {
    const path=dir?dir:""
    setcurrentpath(path)
   
    getfiles(path);
  }, [dir,currentpath]);


  const toastColor =
    toast.type === "error"
      ? "bg-red-600"
      : toast.type === "sucess"
      ? "bg-green-600"
      : "bg-gray-800";


  return (
    <div className="min-h-screen bg-gray-50">
     <div className="fixed top-3.5 right-3 flex gap-4 z-50">
  <Link
    to="/register"
    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
  >
    Register
  </Link>

  <Link
    to="/login"
    className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
  >
    Login
  </Link>
</div>

      {/* Header - Just made it look better */}
      <header className="bg-white border-b sticky top-0">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Storage</h1>
          <div className=" flex gap-5">
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer hover:bg-indigo-70"
              onClick={folderinputfunction}
            >
             create Folder
            </button>
           {/* Modal overlay */}
{showfodlerinput && (
  <div
    className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4"
    onClick={() => setshowfolderinput(false)}
  >
    {/* Modal dialog */}
    <div
      className="bg-white rounded-lg shadow-2xl w-full max-w-md mt-24"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Dialog content with proper padding */}
      <div className="px-6 pt-6 pb-5">
        <h2 className="text-xl font-normal text-gray-900 mb-5">New folder</h2>
       
        {/* Input with bottom border style */}
        <div className="relative">
          <input
            type="text"
            value={foldername}
            onChange={(e) => setfoldername(e.target.value)}
            className="w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none text-base"
            placeholder="Untitled folder"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handlecreatefolder();
              }
            }}
          />
        </div>
      </div>
     
      {/* Action buttons - right aligned */}
      <div className="flex justify-end gap-2 px-6 py-4">
        <button
          className="px-6 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
          onClick={() => setshowfolderinput(false)}
        >
          Cancel
        </button>
        <button
          className="px-6 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
          onClick={handlecreatefolder}
        >
          Create
        </button>
      </div>
    </div>
  </div>
)}


            {newname && (
              <div className="mb-4">
                <input
                  type="text"
                  value={newname}
                  onChange={(e) => setnewname(e.target.value)}
                  className="w-full md:w-96 px-3 py-2 border rounded"
                  placeholder="New name"
                />
              </div>
            )}


            <label className="px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer hover:bg-indigo-700">
              Upload
              <input type="file" onChange={handelfile} className="hidden" />
            </label>
          </div>
        </div>
      </header>


      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Progress & Toast */}
        <div className="mb-4 flex items-center gap-4">
          {progress > 0 && (
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-indigo-600 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs">{progress}%</span>
            </div>
          )}
          {toast.message && (
            <div
              className={`px-4 py-2 rounded text-white text-sm ${toastColor}`}
            >
              {toast.message}
            </div>
          )}
        </div>


        {/* Rename Input */}
        {newname && (
          <div className="mb-4">
            <input
              type="text"
              value={newname}
              onChange={(e) => setnewname(e.target.value)}
              className="w-full md:w-96 px-3 py-2 border rounded"
              placeholder="New name"
            />
          </div>
        )}
{/* back button */}
 <div className="flex items-center gap-3">
                {/* Back button - only show if not at root */}
                {currentpath && (
                    <button
                        onClick={handleBack}
                        className="px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-1"
                    >
                        <span>←</span> Back
                    </button>
                )}
               
             
               
                {/* Show current path */}
                {currentpath && (
                    <span className="text-sm text-gray-500">/ {currentpath}</span>
                )}
            </div>
        {/* Folders */}
       
        {
         
          <div className="mb-6">
            <h2 className="text-sm font-medium mb-2">Folders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {directorylist.length>0? directorylist
                             .map((item, did) => (
                  <div key={did} className="p-3 border rounded bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">📁</span>
                     <span className="font-medium">
  {folderRenameId === item.did ? (
    <input
      value={folderNewName}
      onChange={(e) => setFolderNewName(e.target.value)}
      className="px-2 py-1 border rounded text-xs"
      autoFocus
    />
  ) : (
    item.name
  )}
</span>


                    </div>
                    <div className="flex gap-2 text-xs">
                      <button
                        onClick={() => handleDirectory(item.did)}
                        className="px-2 py-1 bg-gray-100 rounded"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => {
                          setFolderNewName(item.name)
                          setFolderRenameId(item.did)



                        }}
                        className="px-2 py-1 bg-gray-100 rounded"
                      >
                        Rename
                      </button>
              {
                folderRenameId===item.did &&(
                  <div>
               
                    <button
                    className="px-2 py-1 bg-indigo-600 text-white rounded text-xs"
                    onClick={()=>handlefolderrename(item.did)}>
SAVE
                    </button>
                  </div>
                )
              }



                      <button
                        onClick={() => handledelete(item.name,item.isDirectory)}
                        className="px-2 py-1 bg-red-50 text-red-600 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )):"No folders are there make oen to get started"}
            </div>
          </div>
        }


        {/* Files */}
        <div className="bg-white border rounded">
          <div className="px-4 py-2 bg-gray-50 border-b font-medium text-sm">
            Files
          </div>
          {fileslist
           
            .map(({id,ext,name}) => (
             
              <div
                key={id}
                className="px-4 py-3 border-b hover:bg-gray-50 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                    {ext}
                  </div>
                  <span className="text-sm">{name}</span>
                </div>
                <div className="flex gap-2 text-xs">
                  {/* //file open  */}
                  <a
                    href={`${Base_url}/files/${
                     id
                    }`}
                    className="px-2 py-1 bg-gray-100 rounded"
                  >
                    Open
                  </a>
                  <a
                    href={`${Base_url}/files/${id}?action=download`}
                    className="px-2 py-1 bg-gray-100 rounded"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => handlenewname(name)}
                    className="px-2 py-1 bg-gray-100 rounded"
                  >
                    Rename
                  </button>
                  {renamefile === name && (
                    <button
                      onClick={() => handelrename(id)}
                      className="px-2 py-1 bg-indigo-600 text-white rounded"
                      >
                      Save
                    </button>
                  )}
                  <button
                  onClick={() => handledelete(id)}
                   
                    className="px-2 py-1 bg-red-50 text-red-600 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>


        {/* Footer */}
        <div className="mt-6">
          <button
            onClick={handletrash}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Trash
          </button>
        </div>
      </main>
    </div>
  );
};
export default DirectoryView;