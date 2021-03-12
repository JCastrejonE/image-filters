// Modules to control application life and create native browser window
const {BrowserWindow, Menu, app, shell, dialog, nativeTheme, ipcMain} = require('electron')
const fs = require('fs')
const path = require('path')

try {
	require('electron-reloader')(module);
} catch {}

let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 650,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true,
    }
  })

  win.once('ready-to-show', () => {
    win.webContents.setZoomFactor(1)
  })

  // and load the index.html of the app.
  win.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  // win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  nativeTheme.themeSource = 'system'
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

app.setAboutPanelOptions({
  credits: '\nAutor: Juan C. Castrejón\nCorreo: castrejon@ciencias.unam.mx\nProceso digital de imagenes 2021-2, UNAM',
})

ipcMain.on('open-file-dialog', (event) => {
  openFileDialog();
})

function openFileDialog() {
  dialog.showOpenDialog(win, {
    filters: [{ name: 'Images', extensions: ['jpg', 'png'] }]}, {
    properties: ['openFile']
  }).then(result => {
    if (result.canceled)
      return;
    if (result.filePaths) {
      win.send('selected-image', result.filePaths[0])
    }
  }).catch(err => { });
}

ipcMain.on('save-dialog', (event, arg) => {
  saveFileDialog(arg);
})

function saveFileDialog(data) {
  const options = {
    title: 'Save an Image',
    defaultPath: data.defaultPath,
    filters: [
      { name: 'Images', extensions: ['jpg','png'] }
    ]
  }
  dialog.showSaveDialog(win, options).then(result => {
    if (result.canceled)
      return;
    if (result.filePath) {
      // Remove header
      let base64Image = data.image.split(';base64,').pop();
      fs.writeFile(result.filePath, base64Image, {encoding: 'base64'}, function(err) { });
      // win.send('saved-image', result.filePath);
    }
  }).catch(err => { });
}

let template = [{
  label: '&Archivo',
  submenu: [{
    label: '&Abrir imagen',
    accelerator: 'CmdOrCtrl+O',
    click: function (item, focusedWindow) {
      openFileDialog();
    }
  }, {
    label: '&Guardar imagen como',
    accelerator: 'CmdOrCtrl+S',
    click: function (item, focusedWindow) {
      win.send('save-image');
    }
  }, {
    type: 'separator'
  }, {
    label: '&Salir',
    accelerator: 'CmdOrCtrl+Q',
    role: 'close'
  }]
}, {
  label: '&Vista',
  submenu: [{
    label: '&Recargar',
    accelerator: 'CmdOrCtrl+R',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        // on reload, start fresh and close any old
        // open secondary windows
        if (focusedWindow.id === 1) {
          BrowserWindow.getAllWindows().forEach(win => {
            if (win.id > 1) win.close()
          })
        }
        focusedWindow.reload()
      }
    }
  }, {
    label: '&Pantalla completa',
    accelerator: (() => {
      if (process.platform === 'darwin') {
        return 'Ctrl+Command+F'
      } else {
        return 'F11'
      }
    })(),
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
      }
    }
  }, {
    label: 'R&estaurar tamaño',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.setFullScreen(false);
        focusedWindow.setSize(800, 650, false);
      }
    }
  }, {
    type: 'separator'
  }, {
    label: '&Zoom',
    submenu: [{
      label: '&Acercar',
      role: 'zoomIn'
    }, {
      label: 'A&lejar',
      role: 'zoomOut'
    }, {
      type: 'separator'
    }, {
      label: '&Reinicar zoom',
      role: 'resetZoom'
    }]
  }, {
    type: 'separator'
  }, {
    label: '&Herramientas de desarrollador',
    accelerator: (() => {
      if (process.platform === 'darwin') {
        return 'Alt+Command+I'
      } else {
        return 'Ctrl+Shift+I'
      }
    })(),
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.toggleDevTools()
      }
    }
  }, {
    type: 'separator'
  }]
}, {
  label: 'Ay&uda',
  submenu: [{
    label: 'Version 1.0',
    enabled: false
  }, {
    label: '&Acerca de',
    role: 'about'
  }]
}]

app.on('ready', () => {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
})