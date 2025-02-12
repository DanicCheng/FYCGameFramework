// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, screen } = require('electron')
const path = require('node:path')
const Store = require('electron-store')

// 创建一个 Store 实例来保存和读取窗口配置
const store = new Store()

let mainWindow
const createWindow = () => {

  let game_width = store.get('game_width', 1280)
  let game_height = store.get('game_height', 720)
  let game_isFullScreen = store.get('game_isFullScreen', false)

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: game_width,
    height: game_height,
    frame: true,
    resizable: true,
    useContentSize: true,
    // icon: __dirname + '/build/icon.png',
    fullscreen: game_isFullScreen,
    // titleBarStyle: 'hidden',
    webPreferences: {
      // 下面三个网页功能设置，必须写这些，如果不写Cocos就不能调用封装好的事件
      nodeIntegration: true, // 开启true这一步很重要，目的时为了web文件中可以引入node和electron相关的API
      enableRemoteModule: false, // 可以使用remote方法
      contextIsolation: false,   // 可以使用require方法

      preload: path.join(__dirname, 'preload.js')
    }
  })
  // 移除菜单栏
  mainWindow.removeMenu()

  // 加载 index.html
  //   mainWindow.loadFile('index.html')
  // mainWindow.loadURL('file://' + __dirname + '/web-mobile/index.html')
  mainWindow.loadURL($KEY_WEB_URL)

  // 打开开发工具
  // mainWindow.webContents.openDevTools()
  // mainWindow.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on("web-contents-created", (_, contents) => {
  contents.on("before-input-event", (event, input) => {
    if (input.code == "F4" && input.alt) {
      app.quit();
    }
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态, 
// 直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。

// 设置分辨率 非全屏才有效
ipcMain.on('game_setResolution', (event, width, height) => {
  if (mainWindow) {
    mainWindow.unmaximize()
    mainWindow.setSize(width, height)
    store.set('game_width', width)
    store.set('game_height', height)
    mainWindow.center()
  }
})

// 设置窗口模式
ipcMain.on('game_setFullScreen', (event, isFullScreen) => {
  if (mainWindow) {
    if (isFullScreen) {
      mainWindow.setFullScreen(true)
      store.set('game_isFullScreen', true)
    } else {
      mainWindow.setFullScreen(false)
      store.set('game_isFullScreen', false)
    }
    event.sender.send("game_canvas_resize")
    mainWindow.center()
  }
})

// 设置窗口模式
ipcMain.on('game_setWindowMode', (event, mode) => {
  if (mainWindow) {
    if (mode == "FullScreen") {
      mainWindow.setFullScreen(true)
      store.set('game_windowMode', "FullScreen")
    } else if (mode == "Windowed") {
      mainWindow.setFullScreen(false)
      store.set('game_windowMode', "Windowed")
    }

    mainWindow.center()
    event.sender.send("game_canvas_resize")
  }
})

// 退出游戏
ipcMain.on('game_quit', (event, mode) => {
  if (mainWindow) {
    mainWindow.close()
  }
})

