// import { app, BrowserWindow, screen, Menu ,ipcMain } from 'electron';
// import path from 'path';

const { app, BrowserWindow, screen, Menu ,ipcMain } = require('electron');
const path = require('path');


const isDev = process.env.NODE_ENV === 'DEV';
const isMac = process.platform === 'darwin';

let win;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

win = new BrowserWindow({
  width,
  height,
  frame: false,
  titleBarStyle: 'hidden',
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: false,
  }
})

  if (isDev) {
    win.loadURL('http://localhost:5173').catch(err => {
      console.error('Failed to load dev server:', err);
    });
  } else {
    const distPath = path.join(__dirname, 'dist/index.html');
    win.loadFile(distPath).catch(err => {
      console.error('Failed to load index.html:', err);
    });
  }

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(`Failed to load content: ${errorDescription} (${errorCode})`);
  });


}
// Handle app lifecycle
app.whenReady().then(createWindow);


ipcMain.on('window-minimize', () => {
  if (win) win.minimize();
});

ipcMain.on('window-maximize', () => {
  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }
});

ipcMain.on('window-close', () => {
  if (win) win.close();
});
