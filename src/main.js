const { app, BrowserWindow, ipcMain, protocol } = require("electron");
const { download } = require("electron-dl")
const store = require("./store");
const path = require('path');
const isOnline = require('is-online');


function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreenable: true,
    fullscreen: true,
    titleBarStyle: 'customButtonsOnHover',
    kiosk: true,
    frame: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.resolve(__dirname, 'preload.js')
    }
  })
  win.loadURL('http://localhost:3000');
  win.webContents.openDevTools();
  win.removeMenu();
}

app.whenReady().then( async () => {

  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = request.url.replace('file:///', '');
    callback(pathname);
  });

  //set store
  console.log(app.getPath("userData"),'get path');

  //create window
  await createWindow();
  const win = BrowserWindow.getFocusedWindow();
  
  win.webContents.session.on('will-download', (event, item, webContents) => {
    const url = item.getURL();
    // Set the save path, making Electron not to prompt a save dialog.
    item.setSavePath('appData')
    
    item.on('updated', (event, state) => {

      //check online
      isOnline().then((res) => {
        console.log(res,'check');
      }).catch(() => {
        console.log("error");
      });

      //process download
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
        item.resume();
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })

    //download done
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
  })
 
  ipcMain.on('download', async (event, { url, properties }) => {
    const win = BrowserWindow.getFocusedWindow();

    properties.onCompleted = (res) => {
      //send response to app.js
      event.reply('getResDownload', res)
    }
    
    await download(win, url, properties);

  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  });

  //check store
  ipcMain.on('getStore', async (event, properties) => {
    console.log('get store hihi');
    console.log(store.get("ads"),'get store');
  });

  //set store
  ipcMain.on('setStore', async (event, dataAds) => {
    store.set("ads",dataAds)
  });

  //update count ads every 5s
  ipcMain.on('updateCount', async (event, properties) => {
    let tempAds = store.get("ads");
    console.log(tempAds.count,'check count ads');
    tempAds.count = ++tempAds.count;
    store.set("ads", tempAds);
  })
})

app.on("ready", () => {
  const win = BrowserWindow.getFocusedWindow();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
