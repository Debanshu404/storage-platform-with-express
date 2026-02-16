// const input =document.querySelector('input')
// input.addEventListener('change',async(e)=>{
    
//     const file=e.target.files[0]
//     // const res=await fetch('http://192.168.29.249:4100',{
//     //     method:'POST',
//     //     body:file,
//     //     headers:{
//     //         filename:file.name
//     //     }
//     // })
//     // const data=await res.text()
//     // nb  we cant track the progress directly in fetch it can be done btw but its a hectic task to make things simple we will use xhrhttprequest whihc is indeed odler than fetch but makes out works done
//     const xhr=new XMLHttpRequest()
//     xhr.open("POST",'http://192.168.29.249:4100',true);
//     xhr.setRequestHeader("filename",file.name)
//     xhr.upload.addEventListener('progress',(e)=>{
//         if(e.lengthComputable){
//             let progress=Math.floor((e.loaded/e.total)*100)
//             console.clear()
//             console.log(`Loading:${progress}%...`)
//         }
//     })
//     xhr.addEventListener('load',(e)=>{
//         console.log(e)
//         console.log(xhr)
//          console.log("Status:", xhr.status);     
//               // HTTP status code
//     console.log("Response:", xhr.responseText); 
//     })
//     xhr.send(file)
// })
