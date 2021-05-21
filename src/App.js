import './App.css';
import React, { useEffect } from 'react'
import LayoutLandScape from "./containers/device";
const url = "https://res.cloudinary.com/c81admanagementstorage/video/upload/v1620882023/Videos/6075bdb39710ee10e851b2e6/kigmjlkg9hhjrus48whn.webm"
const fs = window.require('fs');

function App() {

  useEffect(() => {
    console.log(window, 'window');
  }, []);

  const handleDownload = () => {
    console.log(fs,'fs');
    window.ipcRenderer.send("download", {
      url: url,
      properties: {
        openFolderWhenDone: true,
        directory: "D:/huhu",
        filename: "video1.mp4"
      }
    });
  }

  const handleDeleteFile = () => {
    console.log(window.electron,'window.electron');
    console.log(fs,'fs');
    fs.unlink("D:/huhu/name.png", () => {
      console.log('delete handle');
    });
  }
  
  return (
    <div className="App">
      {/* <button onClick={handleDownload}>Download</button> */}
      {/* <button onClick={handleDeleteFile}>delete file</button> */}
      {/* <ComponentChild /> */}
      <LayoutLandScape />
    </div>
  );
}

export default App;
