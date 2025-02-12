import fs from 'fs-extra';
import path from 'path';
import Utility from '../../../Utility';
import Const from '../../../Const';
import { ChildProcessWithoutNullStreams, spawn, exec } from 'child_process';

/** 子进程 */
let childProcess: ChildProcessWithoutNullStreams;

module.exports = Editor.Panel.define({
    listeners: {
        show() { console.log('show'); },
        hide() { console.log('hide'); },
    },
    template: fs.readFileSync(path.join(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: fs.readFileSync(path.join(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        projectName: '#projectName',
        author: '#author',
        version: '#version',
        webPath: '#webPath',
        outputPath: '#outputPath',
        iconPath: '#iconPath',
        isReCopyWeb: '#isReCopyWeb',
        steamAppID: '#steamAppID',
        btnClear: '#btnClear',
        btnPreview: '#btnPreview',
        btnGen: '#btnGen',
        btnGenSteam: '#btnGenSteam',
        btnStopGen: '#btnStopGen',
        btnOpenOutputPath: '#btnOpenOutputPath',
        btnOpenWebPath: '#btnOpenWebPath',
        log: '#log',
    },
    methods: {
        /** 清空输出目录 */
        async removeOutputPath(success?: Function, fail?: Function) {
            let outputPath: any = this.$.outputPath;
            let log: any = this.$.log;

            if (!fs.existsSync(outputPath.value)) {
                if (success) {
                    success();
                }
                return;
            }

            log.value += `正在删除${outputPath.value}，请稍候...\n`
            // 让界面有时间刷新
            await new Promise(f => setTimeout(f, 1));

            fs.remove(outputPath.value).then(async () => {
                log.value += `删除${outputPath.value}完成\n`
                // 让界面有时间刷新
                await new Promise(f => setTimeout(f, 1));
                if (success) {
                    success();
                }
            }).catch(async (err) => {
                log.value += `删除${outputPath.value}失败: ${err}\n`;
                // 让界面有时间刷新
                await new Promise(f => setTimeout(f, 1));
                if (fail) {
                    fail(err);
                }
            });
        },

        /** 删除Web目录 */
        async removeWebPath(success?: Function, fail?: Function) {
            let log: any = this.$.log;

            const webMobileDestPath = path.join(Const.TEMPLATE_PATH, 'electron', 'web-mobile');
            if (!fs.existsSync(webMobileDestPath)) {
                if (success) {
                    success();
                }
                return;
            }

            log.value += `正在删除${webMobileDestPath}，请稍候...\n`
            // 让界面有时间刷新
            await new Promise(f => setTimeout(f, 1));

            fs.remove(webMobileDestPath).then(async () => {
                log.value += `删除${webMobileDestPath}完成\n`
                // 让界面有时间刷新
                await new Promise(f => setTimeout(f, 1));
                if (success) {
                    success();
                }
            }).catch(async (err) => {
                log.value += `删除${webMobileDestPath}失败: ${err}\n`;
                // 让界面有时间刷新
                await new Promise(f => setTimeout(f, 1));
                if (fail) {
                    fail(err);
                }
            });
        },

        /**
         * 导出构建项目
         * @param success 
         * @param fail 
         * @returns 
         */
        async exportOut(success?: Function, fail?: Function) {
            let outputPath: any = this.$.outputPath;
            let log: any = this.$.log;
            // 不禁用，无法直接拷贝asar文件
            process.noAsar = true;
            const electronOutPath = path.join(Const.TEMPLATE_PATH, 'electron', 'out');
            if (!fs.existsSync(electronOutPath)) {
                log.value += `${electronOutPath}目录不存在`;
                return;
            }
            fs.copy(electronOutPath, outputPath.value).then(async () => {
                log.value += '导出构建项目成功\n'
                // 让界面有时间刷新
                await new Promise(f => setTimeout(f, 1));
                if (success) {
                    success();
                }
            }).catch(async (err) => {
                log.value += `导出构建项目失败: ${err}\n`
                // 让界面有时间刷新
                await new Promise(f => setTimeout(f, 1));
                if (fail) {
                    fail(err);
                }
            });
        },

        /** 拷贝web-mobile */
        async copyWeb(success?: Function, fail?: Function) {
            let webPath: any = this.$.webPath;
            let log: any = this.$.log;
            log.value += '正在拷贝web-mobile资源，请稍候...\n'
            // 让界面有时间刷新
            await new Promise(f => setTimeout(f, 1));

            // 将web-mobile目录下的内容复制到临时目录下的web-mobile文件夹
            const webMobileDestPath = path.join(Const.TEMPLATE_PATH, 'electron/web-mobile');
            fs.copy(webPath.value, webMobileDestPath).then(async () => {
                log.value += '拷贝web-mobile资源完成\n'
                // 让界面有时间刷新
                await new Promise(f => setTimeout(f, 1));
                if (success) {
                    success();
                }
            }).catch(async (err) => {
                log.value += `拷贝web-mobile资源失败: ${err}\n`
                // 让界面有时间刷新
                await new Promise(f => setTimeout(f, 1));
                if (fail) {
                    fail(err);
                }
            });
        },

        async checkWeb(success?: Function, fail?: Function) {
            let isReCopyWeb: any = this.$.isReCopyWeb;
            const webMobileDestPath = path.join(Const.TEMPLATE_PATH, 'electron/web-mobile');

            if (fs.existsSync(webMobileDestPath)) {
                // 如果web-mobile路径存在，并且需要重新拷贝web-mobile资源，则先删除
                if (isReCopyWeb.value) {
                    this.removeWebPath(() => {
                        this.copyWeb(success, fail);
                    }, fail);
                } else {
                    if (success) {
                        success();
                    }
                }
            } else {
                this.copyWeb(success, fail);
            }
        },

        /**
         * 生成配置
         * @param srcFilePath 模板文件路径
         * @param targetFilePath 目标文件路径
         * @param configData 配置数据
         * @returns 
         */
        async genConfig(srcFilePath: string, targetFilePath: string, configData: { [key: string]: string }) {
            let log: any = this.$.log;

            if (!fs.existsSync(srcFilePath)) {
                log.value += `文件不存在.${srcFilePath}\n`
                return;
            }

            let template = fs.readFileSync(srcFilePath, 'utf-8');
            for (let key in configData) {
                let value = configData[key];
                template = template.replace(new RegExp('\\' + key, 'g'), value);
            }

            fs.writeFileSync(targetFilePath, template);
            log.value += `${targetFilePath}文件写入完成\n`
        },

        async copyTemplate(isPreview: boolean, isSteam: boolean) {
            let projectName: any = this.$.projectName;
            let version: any = this.$.version;
            let author: any = this.$.author;
            let webPath: any = this.$.webPath;
            let iconPath: any = this.$.iconPath;
            let configData: { [key: string]: string } = {};
            let steamAppID: any = this.$.steamAppID;
            let files = [
                'main.js',
                'package.json',
                'forge.config.js'
            ]
            if (isSteam) {
                files = [
                    'main.js',
                    'package.json',
                    'forge.config.js',
                    'steam_appid.txt'
                ]
            }
            if (isPreview) {
                let p = path.join(webPath.value, 'index.html');
                p = p.replace(/\\/g, "/");
                configData[Const.TEMPLATE_REPLACE_KEY_WEB_URL] = `"${p}"`;
            } else {
                configData[Const.TEMPLATE_REPLACE_KEY_WEB_URL] = "'file://' + __dirname + '/web-mobile/index.html'";
            }
            if (!fs.existsSync(iconPath.value)) {
                // 如果没有设置图标，则使用默认图标
                configData[Const.TEMPLATE_REPLACE_KEY_ICON] = `./favicon.ico`;
            } else {
                fs.copyFileSync(iconPath.value, path.join(Const.TEMPLATE_PATH, 'electron', 'Icon.ico'));
                configData[Const.TEMPLATE_REPLACE_KEY_ICON] = `./Icon.ico`;
            }
            configData[Const.TEMPLATE_REPLACE_KEY_PROJECT_NAME] = projectName.value;
            configData[Const.TEMPLATE_REPLACE_KEY_PROJECT_VERSION] = version.value;
            configData[Const.TEMPLATE_REPLACE_KEY_AUTHOR] = author.value;
            if (isSteam) {
                if (steamAppID.value == null || steamAppID.value == "") {
                    steamAppID.value = 480;// 测试值
                }
                configData[Const.TEMPLATE_REPLACE_KEY_STEAM_APP_ID] = steamAppID.value;
            }

            for (let i = 0; i < files.length; i++) {
                let srcPath = path.join(Const.TEMPLATE_PATH, files[i]);
                let targetPath = path.join(Const.TEMPLATE_PATH, 'electron', files[i]);
                if (isSteam) {
                    srcPath = path.join(Const.TEMPLATE_PATH, 'steam', files[i]);
                }
                this.genConfig(srcPath, targetPath, configData);
            }

        },

        /** 打包 */
        async package(success?: Function, fail?: Function) {
            let log: any = this.$.log;
            log.value += '正在打包，请稍候...\n'
            // 让界面有时间刷新
            await new Promise(f => setTimeout(f, 1));

            const electronPath = path.join(Const.TEMPLATE_PATH, 'electron');
            this.runNpmCommandInDirectory(['run', 'package'], electronPath, success, fail);
        },

        /** 预览 */
        async preview(success?: Function, fail?: Function) {
            let log: any = this.$.log;
            log.value += '正在预览，请稍候...\n'
            // 让界面有时间刷新
            await new Promise(f => setTimeout(f, 1));

            const electronPath = path.join(Const.TEMPLATE_PATH, 'electron');
            this.runNpmCommandInDirectory(['run', 'start'], electronPath, success, fail);
        },

        async clearData() {
            let outputPath: any = this.$.outputPath;
            let result = await Editor.Dialog.warn(`确认要清空目录：${outputPath.value}`, { 'buttons': ['取消', '确定'] });
            if (result.response == 1) {
                // 点击确定
                this.removeOutputPath();
            } else if (result.response == 0) {
                // 点击取消
            }
        },

        /**
         * 清理模板数据
         * @returns 
         */
        async clearTemplateData() {
            let log: any = this.$.log;
            const electronOutPath = path.join(Const.TEMPLATE_PATH, 'electron', 'out');
            if (!fs.existsSync(electronOutPath)) {
                return;
            }

            log.value += `正在删除${electronOutPath}，请稍候...\n`
            // 让界面有时间刷新
            await new Promise(f => setTimeout(f, 1));

            fs.remove(electronOutPath).then(async () => {
                log.value += `删除${electronOutPath}完成\n`
                // 让界面有时间刷新
                await new Promise(f => setTimeout(f, 1));
            }).catch(async (err) => {
                log.value += `删除${electronOutPath}失败: ${err}\n`;
                // 让界面有时间刷新
                await new Promise(f => setTimeout(f, 1));
            });
        },

        async doPackage(isSteam: boolean) {
            let log: any = this.$.log;
            let projectName: any = this.$.projectName;
            this.checkWeb(async () => {
                await this.clearTemplateData();
                this.package(() => {
                    if (isSteam) {
                        const electronPath = path.join(Const.TEMPLATE_PATH, 'electron');
                        // 源文件的路径
                        const sourceFilePath = path.join(electronPath, 'steam_appid.txt');
                        // 目标目录的路径
                        const targetDirectoryPath = path.join(electronPath, 'out', projectName.value + '-win32-x64');
                        // 目标文件的完整路径，这里假设源文件和目标文件名称相同
                        const targetFilePath = path.join(targetDirectoryPath, path.basename(sourceFilePath));

                        fs.copyFile(sourceFilePath, targetFilePath, (err) => {
                            if (err) {
                                log.value += `拷贝steam_appid.txt失败，${err}\n`;
                            } else {
                                log.value += '拷贝steam_appid.txt成功\n';
                                this.exportOut();
                            }
                        });
                    } else {
                        this.exportOut();
                    }
                });
            });
        },

        async doPreview() {
            this.preview();
        },

        async saveData() {
            let projectName: any = this.$.projectName;
            let version: any = this.$.version;
            let author: any = this.$.author;
            let webPath: any = this.$.webPath;
            let outputPath: any = this.$.outputPath;
            let iconPath: any = this.$.iconPath;
            let steamAppID: any = this.$.steamAppID;
            // 获取项目名称
            if (projectName.value == null || projectName.value == 'undefined' || projectName.value == '') {
                projectName.value = Const.PROJECT_NAME_DEFAULT;
            }
            Utility.save(Const.KEY_PROJECT_NAME, projectName.value);

            // 作者
            if (author.value == null || author.value == 'undefined' || author.value == '') {
                author.value = Const.AUTHOR_DEFAULT;
            }
            Utility.save(Const.KEY_AUTHOR, author.value);

            // 版本
            if (version.value == null || version.value == 'undefined' || version.value == '') {
                version.value = Const.PROJECT_VERSION_DEFAULT;
            }
            Utility.save(Const.KEY_PROJECT_VERSION, version.value);

            // 先确保web-mobile目录存在并且有内容
            if (!fs.existsSync(webPath.value) || fs.readdirSync(webPath.value).length === 0) {
                webPath.value = path.join(Const.BUILD_PATH, Const.WEB_NAME_DEFAULT);
            }
            Utility.save(Const.KEY_WEB_PATH, webPath.value);

            // 先确保output目录存在并且有内容
            if (!fs.existsSync(outputPath.value) || fs.readdirSync(outputPath.value).length === 0) {
                outputPath.value = path.join(Const.BUILD_PATH, Const.OUTPUT_NAME_DEFAULT);
            }
            Utility.save(Const.KEY_OUTPUT_PATH, outputPath.value);

            // 先确保icon文件存在并且有内容
            if (!fs.existsSync(iconPath.value)) {
                iconPath.value = '';
            }
            Utility.save(Const.KEY_ICON_PATH, iconPath.value);

            // steamAppID
            if (steamAppID.value == null || steamAppID.value == 'undefined' || steamAppID.value == '') {
                steamAppID.value = Const.STEAM_APP_ID_DEFAULT;
            }
            Utility.save(Const.KEY_STEAM_APP_ID, steamAppID.value);
        },

        killNpmProcess() {
            if (childProcess) {
                childProcess.kill();
            }
        },

        /**
         * 在指定目录下运行npm命令
         * @param commands 命令
         * @param directory 执行命令的目录
         */
        runNpmCommandInDirectory(commands: string[], directory: string, success?: Function, fail?: Function) {
            let log: any = this.$.log;
            if (childProcess) {
                childProcess.kill();
            }

            childProcess = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', commands, { cwd: directory });

            childProcess.stdout.on('data', (data) => {
                // console.log(`stdout: ${data}`);
                log.value += `${data}\n`;
            });

            childProcess.stderr.on('data', (data) => {
                // console.error(`stderr: ${data}`);
                log.value += `${data}\n`;
            });

            childProcess.on('close', (code) => {
                // console.log(`electron-forge make exited with code ${code}`);
                if (code == 0) {
                    log.value += '成功\n';
                    if (success) {
                        success();
                    }
                } else {
                    log.value += '失败\n';
                    if (fail) {
                        fail();
                    }
                }
            });
        },
        /** 构建数据 */
        async onPackage() {
            let log: any = this.$.log;
            this.saveData();
            this.copyTemplate(false, false);
            log.value = '';

            this.doPackage(false);
        },

        /** 构建Steam版 */
        async onPackageSteam() {
            let log: any = this.$.log;
            this.saveData();
            this.copyTemplate(false, true);
            log.value = '';

            this.doPackage(true);
        },

        /** 预览 */
        async onPreview() {
            let log: any = this.$.log;
            this.saveData();
            this.copyTemplate(true, false);
            log.value = '';

            this.doPreview();
        },
    },
    ready() {
        if (this.$.projectName) {
            let projectName: any = this.$.projectName;
            projectName.value = Utility.load(Const.KEY_PROJECT_NAME);
            if (projectName.value == null || projectName.value == 'undefined' || projectName.value == '') {
                projectName.value = Const.PROJECT_NAME_DEFAULT;
            }
            projectName.addEventListener('confirm', (event: any) => {
                if (event.target) {
                    projectName.value = event.target.value;
                }
            });
        }

        if (this.$.version) {
            let version: any = this.$.version;
            version.value = Utility.load(Const.KEY_PROJECT_VERSION);
            if (version.value == null || version.value == 'undefined' || version.value == '') {
                version.value = Const.PROJECT_VERSION_DEFAULT;
            }
            version.addEventListener('confirm', (event: any) => {
                if (event.target) {
                    version.value = event.target.value;
                }
            });
        }

        if (this.$.author) {
            let author: any = this.$.author;
            author.value = Utility.load(Const.KEY_AUTHOR);
            if (author.value == null || author.value == 'undefined' || author.value == '') {
                author.value = Const.AUTHOR_DEFAULT;
            }
            author.addEventListener('confirm', (event: any) => {
                if (event.target) {
                    author.value = event.target.value;
                }
            });
        }

        if (this.$.webPath) {
            let webPath: any = this.$.webPath;
            webPath.value = Utility.load(Const.KEY_WEB_PATH);
            // 如果webPath没有值或者没有内容，则使用默认路径
            if (!fs.existsSync(webPath.value) || fs.readdirSync(webPath.value).length === 0) {
                webPath.value = path.join(Const.BUILD_PATH, Const.WEB_NAME_DEFAULT);
            }
            webPath.addEventListener('confirm', (event: any) => {
                if (event.target) {
                    webPath.value = event.target.value;
                }
            });
        }

        if (this.$.outputPath) {
            let outputPath: any = this.$.outputPath;
            outputPath.value = Utility.load(Const.KEY_OUTPUT_PATH);
            // 如果outputPath没有值或者没有内容，则使用默认路径
            if (!fs.existsSync(outputPath.value) || fs.readdirSync(outputPath.value).length === 0) {
                outputPath.value = path.join(Const.BUILD_PATH, Const.OUTPUT_NAME_DEFAULT);
            }
            outputPath.addEventListener('confirm', (event: any) => {
                if (event.target) {
                    outputPath.value = event.target.value;
                }
            });
        }

        if (this.$.iconPath) {
            let iconPath: any = this.$.iconPath;
            iconPath.value = Utility.load(Const.KEY_ICON_PATH);
            // 如果icon不存在，则使用默认路径
            if (!fs.existsSync(iconPath.value)) {
                iconPath.value = '';
            }
            iconPath.addEventListener('confirm', (event: any) => {
                if (event.target) {
                    iconPath.value = event.target.value;
                }
            });
        }

        if (this.$.steamAppID) {
            let steamAppID: any = this.$.steamAppID;
            steamAppID.value = Utility.load(Const.KEY_STEAM_APP_ID);
            if (steamAppID.value == null || steamAppID.value == 'undefined' || steamAppID.value == '') {
                steamAppID.value = Const.STEAM_APP_ID_DEFAULT;
            }
            steamAppID.addEventListener('confirm', (event: any) => {
                if (event.target) {
                    steamAppID.value = event.target.value;
                }
            });
        }

        if (this.$.btnGen) {
            let btnGen: any = this.$.btnGen;
            btnGen.addEventListener('confirm', () => {
                this.onPackage();
            });
        }

        if (this.$.btnGenSteam) {
            let btnGenSteam: any = this.$.btnGenSteam;
            btnGenSteam.addEventListener('confirm', () => {
                this.onPackageSteam();
            });
        }

        if (this.$.btnPreview) {
            let btnPreview: any = this.$.btnPreview;
            btnPreview.addEventListener('confirm', () => {
                this.onPreview();
            });
        }

        if (this.$.btnClear) {
            let btnClear: any = this.$.btnClear;
            btnClear.addEventListener('confirm', () => {
                this.clearData();
            });
        }

        if (this.$.btnStopGen) {
            let btnStopGen: any = this.$.btnStopGen;
            btnStopGen.addEventListener('confirm', () => {
                this.killNpmProcess();
            });
        }

        if (this.$.btnOpenOutputPath) {
            let btnOpenOutputPath: any = this.$.btnOpenOutputPath;
            btnOpenOutputPath.addEventListener('confirm', () => {
                exec(`start ${(this.$.outputPath as any).value}`);
            });
        }

        if (this.$.btnOpenWebPath) {
            let btnOpenWebPath: any = this.$.btnOpenWebPath;
            btnOpenWebPath.addEventListener('confirm', () => {
                exec(`start ${(this.$.webPath as any).value}`)
            });
        }

        if (this.$.log) {
            let progress: any = this.$.log;
            progress.value = '';
        }
    },
    beforeClose() { },
    close() { },
});

