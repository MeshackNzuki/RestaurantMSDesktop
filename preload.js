const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  // Database operations
  login: (data) => ipcRenderer.invoke('login', data),
  loginWaiter: (data) => ipcRenderer.invoke('loginWaiter', data),
  addWaiter: (data) => ipcRenderer.invoke('addWaiter', data),
  changePassword: (data) => ipcRenderer.invoke('changePassword', data),
  addUser: (data) => ipcRenderer.invoke('addUser', data),
  getCategoriesWithFoods: () => ipcRenderer.invoke('getCategoriesWithFoods'),
  getWaiters: () => ipcRenderer.invoke('getWaiters'),
  getCustomers: () => ipcRenderer.invoke('getCustomers'),
  getTables: () => ipcRenderer.invoke('getTables'),
  getZones: () => ipcRenderer.invoke('getZones')

})
