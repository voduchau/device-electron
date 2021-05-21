const { app, BrowserWindow, ipcMain } = require("electron");
const { download } = require("electron-dl")
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
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.resolve(__dirname, 'preload.js')
    }
  })
  win.loadURL('http://localhost:3000');
  // win.webContents.openDevTools();
  win.removeMenu();
}

app.whenReady().then( async () => {
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
      })

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
    await download(win, url, properties);
  });
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
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
