import './App.css';
import React, { useEffect, useState } from 'react'
import LayoutLandScape from "./containers/device";
const url = "https://res.cloudinary.com/c81admanagementstorage/video/upload/v1620882023/Videos/6075bdb39710ee10e851b2e6/kigmjlkg9hhjrus48whn.webm"
const fs = window.require('fs');


// const store = new Store();

function App() {

  const [countAds, setCountAds] = useState(0);
  const [urlVideo, setUrlVideo] = useState(null);

  useEffect(() => {
    setInterval(() => {
      
    }, 5000);
  },[])

  useEffect(() => {
    console.log(window, 'window');
    // store.set({name: "voduchau"})
  }, []);


  //set count ads + 1 every 5s
  useEffect(() =>{
    setTimeout(() => {
      window.ipcRenderer.send("updateCount");
      setCountAds(countAds + 1)
    }, 5000);
  },[countAds])

  const handleDownload = () => {
    console.log(fs,'fs');
    const properties = {
      openFolderWhenDone: true,
      directory: "D:/uitapp",
      filename: "video-ads-1.mp4",
    }
   
    window.ipcRenderer.send("download", {
      url: url,
      properties
    });


    // get response when download successfully
    window.ipcRenderer.on('getResDownload', (event, arg) => {
      console.log(arg,'res neeeeeee') // prints "pong"
      setUrlVideo(arg.path)
    })
  }

  const handleDeleteFile = () => {
    console.log(window.electron,'window.electron');
    console.log(fs,'fs');
    fs.unlink("D:/huhu/name.png", () => {
      console.log('delete handle');
    });
  };

  const handleGetStore = () => {
    window.ipcRenderer.send("getStore", {
      url: url,
    });
  };

  const handleSetStore = () => {
    window.ipcRenderer.send("setStore", {
      dataAds: {
        advertisement: {
          name: 'advertisement 1',
          previewImage: "https://www.w3schools.com/html/pic_trulli.jpg",
        }
      },
      count: 1
    });
  }
  
  return (
    <div className="App">
      <button onClick={handleDownload}>Download</button>
      {/* <button onClick={handleDeleteFile}>delete file</button> */}
      {/* <ComponentChild /> */}
      <button onClick={handleSetStore}>set store</button>
      <button onClick={handleGetStore}>get store</button>
      <LayoutLandScape urlVideo={urlVideo}/>
    </div>
  );
}

export default App;
