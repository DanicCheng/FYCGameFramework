# 项目简介

- 用Electron将web-mobile项目打包成Windows项目




## 开发环境

- Node.js

- CocosCreator3.3.0



## 安装

```bash
# 安装依赖模块
npm install
# 构建
npm run build
```



## 备注

- 考虑到依赖项可能不好下载，所以保留了node_modules，所以即使不执行安装命令也可以直接运行。



## 插件启动

- CocosCreator菜单-->扩展-->扩展管理器

- 选择项目，找到fy-electron-tools，启动。



## 插件入口

- CocosCreator菜单-->扩展-->ForyunTools-->Electron打包工具

## 游戏数据保存位置

- `C:\Users\<用户名>\AppData\Roaming\<应用名>\Local Storage\leveldb`

## 问题

- 如何遇到构建项目，日志里面提示超时，请打开VPN翻墙，可能是npm访问的库地址被拦截了。
