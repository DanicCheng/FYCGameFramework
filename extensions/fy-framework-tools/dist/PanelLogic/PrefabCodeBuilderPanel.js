"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrefabCodeBuilderConst_1 = __importDefault(require("./PrefabCodeBuilderConst"));
const PrefabCodeBuilderEnum_1 = require("./PrefabCodeBuilderEnum");
const Utility_1 = __importDefault(require("../Utility"));
class PrefabCodeBuilderPanel {
    static init(...params) {
        let btnGenPrefabCode = params[0];
        let pgGenPrefabCode = params[1];
        if (!btnGenPrefabCode || !pgGenPrefabCode) {
            console.error('btnGenPrefabCode is null or pgGenPrefabCode is null');
            return;
        }
        this._btnGenPrefabCode = btnGenPrefabCode;
        this._pgGenPrefabCode = pgGenPrefabCode;
        this._pgGenPrefabCode.message = '未开始构建';
        this._btnGenPrefabCode.addEventListener('confirm', async () => {
            this.genCustomTypeMap();
            // 只能点击一次
            this._btnGenPrefabCode.setAttribute('disabled', '');
            this._pgGenPrefabCode.message = '开始构建';
            this._pgGenPrefabCode.value = 1;
            // 资源变化表
            let assetChangeFlagData = [];
            if (Utility_1.default.isExist(PrefabCodeBuilderConst_1.default.TEMP_DATA_FILE)) {
                let raw = Utility_1.default.readFile(PrefabCodeBuilderConst_1.default.TEMP_DATA_FILE);
                assetChangeFlagData = JSON.parse(raw);
            }
            else {
                Utility_1.default.checkDirectory(PrefabCodeBuilderConst_1.default.TEMP_PATH);
                Utility_1.default.checkDirectory(PrefabCodeBuilderConst_1.default.TEMP_DATA_PATH);
            }
            await this.genAllPrefabClass(PrefabCodeBuilderConst_1.default.PREFAB_PATH, PrefabCodeBuilderEnum_1.PrefabCodeBuilderEnum.PrefabType.UI, assetChangeFlagData);
            await this.genAllPrefabClass(PrefabCodeBuilderConst_1.default.PREFAB_PATH, PrefabCodeBuilderEnum_1.PrefabCodeBuilderEnum.PrefabType.Entity, assetChangeFlagData);
            // 清空数据
            assetChangeFlagData = [];
            Utility_1.default.writeFile(PrefabCodeBuilderConst_1.default.TEMP_DATA_FILE, JSON.stringify(assetChangeFlagData));
            this._btnGenPrefabCode.removeAttribute('disabled');
            this._pgGenPrefabCode.message = '构建完成';
            this._pgGenPrefabCode.value = 100;
            console.log('脚本生成完成');
        });
    }
    /**
     * 提炼节点名字
     * @param nodeName 节点名字
     * @returns
     */
    static extractNodeName(nodeName) {
        const matches = nodeName.match(/([^#]*)#\{([^}]+)\}/);
        if (matches) {
            // 提取名字部分
            const name = matches[1];
            const components = matches[2].split('|').map(part => part.trim());
            return {
                name: name,
                components: components
            };
        }
        else {
            return {
                name: nodeName
            };
        }
    }
    /**
     * 生成组件信息
     * @param nodeDict 节点信息字典
     * @returns
     */
    static genComponentInfo(nodeDict) {
        if (!nodeDict) {
            return;
        }
        let nodeList = [];
        for (let key in nodeDict) {
            // 如果是根节点，或者开始和末尾都是_，则认为是需要获取组件的节点
            if ((key.startsWith('_') && key.endsWith('_')) || key.startsWith('P_')) {
                // 节点名字
                let name = '';
                // 组件名字数组
                let components = null;
                if (key.startsWith('P_')) {
                    // 根节点名字
                    name = 'Node';
                    let result = this.extractNodeName(key);
                    if (result.components) {
                        components = result.components;
                    }
                }
                else {
                    let content = key.substring(1, key.length - 1);
                    let result = this.extractNodeName(content);
                    name = result.name;
                    if (result.components) {
                        components = result.components;
                    }
                }
                let nodeInfo = nodeDict[key];
                if (!nodeInfo) {
                    continue;
                }
                if (components == null) {
                    components = nodeInfo['components'];
                }
                if (components == null || components == undefined) {
                    // 解决根节点只有Node导致的报错
                    nodeList.push({ name: name, path: nodeInfo['path'], components: components });
                    continue;
                }
                // 去掉cc.Node，因为默认第一个获取的就是Node，而且Node不能通过GetComponent获取，Node不是Component
                components = components.filter(item => item !== "cc.Node");
                nodeList.push({ name: name, path: nodeInfo['path'], components: components });
            }
        }
        return nodeList;
    }
    /**
     * 生成节点路径
     * @param prefabJson 预制信息
     * @param curIndex 当前索引
     * @param nodeDict 节点信息字典
     * @param nodeNameList 节点名字列表
     * @returns
     */
    static genNodePath(prefabJson, curIndex, nodeDict, nodeNameList) {
        var _a, _b, _c;
        if (!curIndex) {
            curIndex = 0;
        }
        if (prefabJson.length <= curIndex) {
            // 读取完毕
            return nodeDict;
        }
        // console.log(`curIndex:${curIndex}, nodeDict:${nodeDict}, nodeNameList:${nodeNameList}`);
        let type = (_a = prefabJson === null || prefabJson === void 0 ? void 0 : prefabJson[curIndex]) === null || _a === void 0 ? void 0 : _a['__type__'];
        let name = (_b = prefabJson === null || prefabJson === void 0 ? void 0 : prefabJson[curIndex]) === null || _b === void 0 ? void 0 : _b['_name'];
        if (!type.startsWith('cc.')) {
            // 如果类型不是cc.开头的，则是自定义的类型，自定义类型名加密了，需要找到原名
            let t = (_c = this._customTypeInfoMap[type]) === null || _c === void 0 ? void 0 : _c.name;
            if (t != null) {
                type = t;
            }
        }
        if (type === 'cc.Node') {
            let nodePath = '';
            if (nodeNameList && nodeNameList.length > 1) {
                for (let i = 1; i < nodeNameList.length; i++) {
                    nodePath += nodeNameList[i] + '/';
                }
                nodePath = nodePath + name;
            }
            else {
                // 第一个节点是根节点，没有路径，从第二节点开始有路径
                if ((nodeNameList === null || nodeNameList === void 0 ? void 0 : nodeNameList.length) === 1) {
                    nodePath = name;
                }
            }
            // 添加节点名
            if (!nodeNameList) {
                nodeNameList = [name];
            }
            else {
                nodeNameList.push(name);
            }
            let nodeInfo = { 'path': nodePath };
            // 添加节点信息
            (nodeDict !== null && nodeDict !== void 0 ? nodeDict : (nodeDict = {}))[name] = nodeInfo;
        }
        else if (type === 'cc.PrefabInfo') {
            // 节点结束符号，移除最后节点，解析完毕一个节点，则移除，因为每次解析，都是从列表里面最后一个节点开始解析。
            if (nodeNameList && nodeNameList.length > 0) {
                nodeNameList.pop();
            }
        }
        else if (type !== 'cc.CompPrefabInfo' && type !== 'cc.Prefab' && type !== 'cc.TargetOverrideInfo' && type !== 'cc.TargetInfo') {
            // cc.TargetOverrideInfo目前不做处理 与预制引用有关
            // cc.TargetInfo目前不做处理 与预制引用有关
            // 组件
            let nodeName = nodeNameList[nodeNameList.length - 1];
            let nodeInfo = nodeDict[nodeName];
            let nodeComponents = nodeInfo['components'];
            if (Array.isArray(nodeComponents)) {
                nodeComponents.push(type);
            }
            else {
                nodeComponents = [type];
            }
            nodeInfo['components'] = nodeComponents;
        }
        return this.genNodePath(prefabJson, curIndex + 1, nodeDict, nodeNameList);
    }
    /**
     * 生成视图类
     * @param componentInfoList 组件信息列表
     * @param clsName 类名
     * @param prefabType 预制类型
     * @param scriptPath 脚本路径
     * @returns
     */
    static genViewClass(componentInfoList, clsName, prefabType, scriptPath) {
        if (!Utility_1.default.isExist(PrefabCodeBuilderConst_1.default.TEMPLATE_PATH)) {
            console.error('目录不存在:' + PrefabCodeBuilderConst_1.default.TEMPLATE_PATH);
            return;
        }
        if (!componentInfoList) {
            console.error('componentInfoList is null or undefined');
            return;
        }
        let viewTemplate = Utility_1.default.readFile(PrefabCodeBuilderConst_1.default.TEMPLATE_PATH + '/' + PrefabCodeBuilderConst_1.default.TEMPLATE_FILE_CONFIG[prefabType]['View']);
        let imports = '{ _decorator, find, Node';
        let importCustomTypes = '';
        let className = clsName;
        let variableDeclarations = '';
        let variableAssignment = '';
        let eventOn = '';
        let eventOff = '';
        let eventCallback = '';
        let prefabName = `P_${prefabType}_${className.substring(0, className.length - 4)}`;
        // 用字典来做重复排除
        let componentDict = {};
        let len = componentInfoList.length;
        for (let i = 0; i < len; i++) {
            let componentInfo = componentInfoList[i];
            let name = componentInfo.name;
            let components = componentInfo.components;
            let path = componentInfo.path;
            let variableName = `c${name}`;
            variableDeclarations += `public ${variableName}: Node;\n    `;
            if (path === '') {
                // 如果没有路径，则代表是根节点，则直接等于this.node
                variableAssignment += `this.${variableName} = this.node;\n        `;
            }
            else {
                variableAssignment += `this.${variableName} = find('${path}', this.node);\n        `;
            }
            // 存在只有Node没有其他组件的情况
            if (components) {
                let cLen = components.length;
                for (let j = 0; j < cLen; j++) {
                    // 判断是否是自定义脚本
                    let componentType = components[j];
                    if (components[j].startsWith('cc.')) {
                        componentType = components[j].substring(3, components[j].length);
                        if (componentDict[componentType] != true) {
                            // 如果没有导入，则导入
                            imports += `, ${componentType}`;
                            componentDict[componentType] = true;
                        }
                    }
                    else {
                        // 自定义类型
                        let relativePath = Utility_1.default.getRelativePath(scriptPath, this._customTypeInfoMap[componentType].absolutePath);
                        if (componentDict[componentType] != true) {
                            // 如果没有导入，则导入
                            importCustomTypes += `import { ${componentType} } from '${relativePath}';\n`;
                            componentDict[componentType] = true;
                        }
                    }
                    variableDeclarations += `public ${variableName}${componentType}: ${componentType} = undefined;\n    `;
                    variableAssignment += `this.${variableName}${componentType} = this.${variableName}.getComponent(${componentType});\n        `;
                    let componentEventConfig = PrefabCodeBuilderConst_1.default.COMPONENT_EVENT_CONFIG[componentType];
                    if (componentEventConfig) {
                        let cecLen = componentEventConfig.length;
                        for (let k = 0; k < cecLen; k++) {
                            let functionName = componentEventConfig[k]['FunctionName'];
                            let eventName = componentEventConfig[k]['EventName'];
                            let callbackName = `on${variableName}${componentType}${functionName}`;
                            eventOn += `        this.${variableName}${componentType}.node.on('${eventName}', this.${callbackName}, this);\n`;
                            eventOff += `        this.${variableName}${componentType}.node.off('${eventName}', this.${callbackName}, this);\n`;
                            eventCallback += `    private ${callbackName}(component: ${componentType}) {\n`;
                            eventCallback += `        this.emit('${eventName}', component);\n`;
                            eventCallback += `    }\n\n`;
                        }
                    }
                }
            }
        }
        imports += ' }';
        viewTemplate = viewTemplate.replace(PrefabCodeBuilderConst_1.default.VIEW_KEY_IMPORT, imports);
        viewTemplate = viewTemplate.replace(PrefabCodeBuilderConst_1.default.VIEW_KEY_IMPORT_CUSTOM, importCustomTypes);
        viewTemplate = viewTemplate.replace(new RegExp('\\' + PrefabCodeBuilderConst_1.default.VIEW_KEY_CLASS_NAME, 'g'), className);
        viewTemplate = viewTemplate.replace(new RegExp('\\' + PrefabCodeBuilderConst_1.default.VIEW_KEY_PREFAB_NAME, 'g'), prefabName);
        viewTemplate = viewTemplate.replace(PrefabCodeBuilderConst_1.default.VIEW_KEY_VARIABLE_DECLARATIONS, variableDeclarations);
        viewTemplate = viewTemplate.replace(PrefabCodeBuilderConst_1.default.VIEW_KEY_VARIABLE_ASSIGNMENT, variableAssignment);
        viewTemplate = viewTemplate.replace(PrefabCodeBuilderConst_1.default.VIEW_KEY_EVENT_ON, eventOn);
        viewTemplate = viewTemplate.replace(PrefabCodeBuilderConst_1.default.VIEW_KEY_EVENT_OFF, eventOff);
        viewTemplate = viewTemplate.replace(PrefabCodeBuilderConst_1.default.VIEW_KEY_EVENT_CALLBACK, eventCallback);
        return viewTemplate;
    }
    /**
     * 生成数据模型类
     * @param componentInfoList 组件信息列表
     * @param clsName 类名
     * @param prefabType 预制类型
     * @returns
     */
    static genModelClass(componentInfoList, clsName, prefabType) {
        if (!Utility_1.default.isExist(PrefabCodeBuilderConst_1.default.TEMPLATE_PATH)) {
            console.error('目录不存在:' + PrefabCodeBuilderConst_1.default.TEMPLATE_PATH);
            return;
        }
        if (!componentInfoList) {
            console.error('componentInfoList is null or undefined');
            return;
        }
        let modelTemplate = Utility_1.default.readFile(PrefabCodeBuilderConst_1.default.TEMPLATE_PATH + '/' + PrefabCodeBuilderConst_1.default.TEMPLATE_FILE_CONFIG[prefabType]['Model']);
        let className = clsName;
        let prefabName = `P_${prefabType}_${className.substring(0, className.length - 5)}`;
        modelTemplate = modelTemplate.replace(new RegExp('\\' + PrefabCodeBuilderConst_1.default.VIEW_KEY_CLASS_NAME, 'g'), className);
        modelTemplate = modelTemplate.replace(new RegExp('\\' + PrefabCodeBuilderConst_1.default.VIEW_KEY_PREFAB_NAME, 'g'), prefabName);
        return modelTemplate;
    }
    /**
     * 生成控制器类
     * @param componentInfoList 组件信息列表
     * @param clsName 类名
     * @param prefabType 预制类型
     * @returns
     */
    static genControllerClass(componentInfoList, clsName, prefabType) {
        if (!Utility_1.default.isExist(PrefabCodeBuilderConst_1.default.TEMPLATE_PATH)) {
            console.error('目录不存在:' + PrefabCodeBuilderConst_1.default.TEMPLATE_PATH);
            return;
        }
        if (!componentInfoList) {
            console.error('componentInfoList is null or undefined');
            return;
        }
        let controllerTemplate = Utility_1.default.readFile(PrefabCodeBuilderConst_1.default.TEMPLATE_PATH + '/' + PrefabCodeBuilderConst_1.default.TEMPLATE_FILE_CONFIG[prefabType]['Controller']);
        let className = clsName;
        let prefabName = `P_${prefabType}_${className}`;
        controllerTemplate = controllerTemplate.replace(new RegExp('\\' + PrefabCodeBuilderConst_1.default.VIEW_KEY_CLASS_NAME, 'g'), className);
        controllerTemplate = controllerTemplate.replace(new RegExp('\\' + PrefabCodeBuilderConst_1.default.VIEW_KEY_PREFAB_NAME, 'g'), prefabName);
        return controllerTemplate;
    }
    /**
     * 添加资源变化标记
     * @param assetPath 资源路径
     */
    static addAssetChangeFlag(assetPath) {
        Utility_1.default.checkDirectory(PrefabCodeBuilderConst_1.default.TEMP_PATH);
        Utility_1.default.checkDirectory(PrefabCodeBuilderConst_1.default.TEMP_DATA_PATH);
        let assetChangeFlagData = [];
        if (Utility_1.default.isExist(PrefabCodeBuilderConst_1.default.TEMP_DATA_FILE)) {
            let raw = Utility_1.default.readFile(PrefabCodeBuilderConst_1.default.TEMP_DATA_FILE);
            assetChangeFlagData = JSON.parse(raw);
        }
        if (!assetChangeFlagData) {
            assetChangeFlagData = [];
        }
        let isChanged = false;
        if (assetChangeFlagData.indexOf(assetPath) < 0) {
            // 不存在才添加
            assetChangeFlagData.push(assetPath);
            isChanged = true;
        }
        if (isChanged) {
            // 写入文件
            Utility_1.default.writeFile(PrefabCodeBuilderConst_1.default.TEMP_DATA_FILE, JSON.stringify(assetChangeFlagData));
        }
    }
    /**
     * 生成预制类
     * @param prefabFileName 预制文件名
     * @param prefabType 预制类型
     * @returns
     */
    static genPrefabClass(prefabFileName, prefabType) {
        let sPath = PrefabCodeBuilderConst_1.default.ROOT_EXPORT_PATH + '/' + prefabType;
        // 构建View
        let prefabName = prefabFileName.split(`P_${prefabType}_`)[1];
        let moduleName = prefabName.substring(0, prefabName.length - 7);
        let viewClassName = moduleName + 'View';
        let modulePath = sPath + '/' + moduleName;
        let scriptPath = modulePath + `/${viewClassName}.ts`;
        let prefabRaw = Utility_1.default.readFile(prefabFileName);
        let prefabJson = JSON.parse(prefabRaw);
        let nodePath = this.genNodePath(prefabJson);
        if (!nodePath) {
            return;
        }
        let components = this.genComponentInfo(nodePath);
        if (!components) {
            return;
        }
        let viewClass = this.genViewClass(components, viewClassName, prefabType, scriptPath);
        if (!viewClass) {
            return;
        }
        Utility_1.default.checkDirectory(modulePath);
        // 写入文件
        Utility_1.default.writeFile(scriptPath, viewClass);
        // 构建Model
        let modelClassName = moduleName + 'Model';
        let modelScriptPath = `${sPath}/${moduleName}/${modelClassName}.ts`;
        if (!Utility_1.default.isExist(modelScriptPath)) {
            // 如果没有构建，则构建
            let modelClass = this.genModelClass(components, modelClassName, prefabType);
            if (!modelClass) {
                return;
            }
            // 写入文件
            Utility_1.default.writeFile(modelScriptPath, modelClass);
        }
        // 构建Controller
        let controllerClassName = moduleName;
        let controllerScriptPath = `${sPath}/${moduleName}/${controllerClassName}.ts`;
        if (!Utility_1.default.isExist(controllerScriptPath)) {
            // 如果没有构建，则构建
            let controllerClass = this.genControllerClass(components, controllerClassName, prefabType);
            if (!controllerClass) {
                return;
            }
            // 写入文件
            Utility_1.default.writeFile(controllerScriptPath, controllerClass);
        }
    }
    /**
     * 生成所有预制类
     * @param resourceRootPath 资源根目录
     * @param prefabType 预制类型
     * @param assetChangeFlagData 资源
     * @returns
     */
    // public static async genAllPrefabClass(resourceRootPath: string, prefabType: PrefabCodeBuilderEnum.PrefabType, assetChangeFlagData: Array<string>) {
    //     let resourcePath = resourceRootPath + '/' + prefabType;
    //     if (!Utility.isExist(resourcePath)) {
    //         console.warn(`预制类型为:${prefabType},其目录不存在:${resourcePath}`);
    //         return;
    //     }
    //     // 文件字典 key 文件名不含扩展名 value 文件在resources下的路径
    //     let fileDict: { [key: string]: string } = {};
    //     let fileNames = Utility.readFileList(resourcePath, []);
    //     let fileNamesLen = fileNames.length;
    //     this._genCount = 0;
    //     if (fileNamesLen <= 0) {
    //         // console.log(`没有需要生成的脚本, 脚本类型: ${prefabType}`);
    //         return;
    //     }
    //     Utility.checkDirectory(PrefabCodeBuilderConst.ROOT_EXPORT_PATH);
    //     let sPath = PrefabCodeBuilderConst.ROOT_EXPORT_PATH + '/' + prefabType;
    //     Utility.checkDirectory(sPath);
    //     for (let i = 0; i < fileNamesLen; i++) {
    //         // 构建View
    //         let prefabName = fileNames[i].split(`P_${prefabType}_`)[1];
    //         let moduleName = prefabName.substring(0, prefabName.length - 7);
    //         let viewClassName = moduleName + 'View';
    //         let modulePath = sPath + '/' + moduleName;
    //         let scriptPath = modulePath + `/${viewClassName}.ts`;
    //         this._pgGenPrefabCode.message = fileNames[i];
    //         this._pgGenPrefabCode.value = this._genCount / fileNamesLen * 100;
    //         // 让界面有时间刷新
    //         await new Promise(f => setTimeout(f, 1));
    //         this._genCount++;
    //         if (Utility.isExist(scriptPath) && assetChangeFlagData.indexOf(fileNames[i]) < 0) {
    //             // 如果View的脚本已经存在，但是又不在修改列表里面，则不需要创建
    //             continue;
    //         }
    //         // 生成脚本
    //         this.genPrefabClass(fileNames[i], prefabType);
    //     }
    //     // 编辑器刷新 将新创建的资源导入
    //     Editor.Message.request('asset-db', 'refresh-asset', `db://assets/Script/${prefabType}`);
    // }
    /**
     * 生成所有预制类
     * @param resourceRootPath 资源根目录
     * @param prefabType 预制类型
     * @param assetChangeFlagData 资源
     * @returns
     */
    static async genAllPrefabClass(resourceRootPath, prefabType, assetChangeFlagData) {
        let resourcePath = resourceRootPath + '/' + prefabType;
        if (!Utility_1.default.isExist(resourcePath)) {
            console.warn(`预制类型为:${prefabType},其目录不存在:${resourcePath}`);
            return;
        }
        // 异步读取文件列表
        let fileNames = await Utility_1.default.readFileListAsync(resourcePath, [], ['.meta', '.DS_Store', '']);
        let fileNamesLen = fileNames.length;
        this._genCount = 0;
        if (fileNamesLen <= 0) {
            return;
        }
        // 预先创建必要的目录
        Utility_1.default.checkDirectory(PrefabCodeBuilderConst_1.default.ROOT_EXPORT_PATH);
        let sPath = PrefabCodeBuilderConst_1.default.ROOT_EXPORT_PATH + '/' + prefabType;
        Utility_1.default.checkDirectory(sPath);
        for (let i = 0; i < fileNamesLen; i++) {
            // 并行处理每一批
            await Promise.all(fileNames.map(async (fileName) => {
                let prefabName = fileName.split(`P_${prefabType}_`)[1];
                let moduleName = prefabName.substring(0, prefabName.length - 7);
                let viewClassName = moduleName + 'View';
                let modulePath = sPath + '/' + moduleName;
                let scriptPath = modulePath + `/${viewClassName}.ts`;
                // 更新进度
                this._genCount++;
                this._pgGenPrefabCode.message = fileName;
                this._pgGenPrefabCode.value = (this._genCount / fileNamesLen) * 100;
                // 检查是否需要生成脚本
                if (Utility_1.default.isExist(scriptPath) && assetChangeFlagData.indexOf(fileName) < 0) {
                    return;
                }
                // 生成脚本
                await this.genPrefabClass(fileName, prefabType);
                // 每批处理完后暂停一小段时间，避免阻塞UI
                await new Promise(f => setTimeout(f, 10));
            }));
        }
        // 编辑器刷新
        await Editor.Message.request('asset-db', 'refresh-asset', `db://assets/Script/${prefabType}`);
    }
    /**
     * 获取自定义类型名
     * @param encrypted 加密字符串
     * @returns
     */
    static getCustomTypeName(encrypted) {
        if (Utility_1.default.isExist(PrefabCodeBuilderConst_1.default.CUSTOM_TYPE_SEARCH_PATH)) {
            let filePaths = Utility_1.default.readFileList(PrefabCodeBuilderConst_1.default.CUSTOM_TYPE_SEARCH_PATH, []);
            for (let i = 0; i < filePaths.length; i++) {
                let filePath = filePaths[i];
                let content = Utility_1.default.readFile(filePath);
                // 参考 _cclegacy._RF.push({}, "8bab18Kl3BDzL3yBG03VPfK", "FYUIComponent", undefined);
                let matchLine = content.match(/_cclegacy._RF.push\(.*\)/g);
                if (matchLine && matchLine.length > 0) {
                    // console.log("matchLine[0] = " + matchLine[0]);
                    // 这里已经找到加密和加密前的自定义类型名
                    let matchWords = matchLine[0].match(/"[^"]+",/g);
                    if (matchWords && matchWords.length >= 2) {
                        // console.log("matchWords[0] = " + matchWords[0]);
                        let matchEncrypted = matchWords[0].match(/[^",]+/g);
                        if (matchEncrypted && matchEncrypted.length > 0 && matchEncrypted[0] == encrypted) {
                            // console.log("matchEncrypted[0] = " + matchEncrypted[0]);
                            // console.log("encrypted = " + encrypted);
                            // 如果找到相同的加密字符串，则获取自定义类型名
                            let matchCustomType = matchWords[1].match(/[^",]+/g);
                            if (matchCustomType && matchCustomType.length > 0) {
                                console.log("matchCustomType[0] = " + matchCustomType[0]);
                                return matchCustomType[0];
                            }
                        }
                    }
                }
            }
        }
        else {
            console.error('没有找到检索目录：' + PrefabCodeBuilderConst_1.default.CUSTOM_TYPE_SEARCH_PATH);
        }
        return null;
    }
    /**
     * 构建自定义类型映射表
     */
    static genCustomTypeMap() {
        this._customTypeInfoMap = {};
        let raw = Utility_1.default.readFile(PrefabCodeBuilderConst_1.default.IMPORT_MAP);
        let importMap = JSON.parse(raw);
        let imports = importMap['imports'];
        for (let key in imports) {
            let value = imports[key];
            if (key.endsWith('.ts')) {
                /** 自定义类型信息 */
                let customTypeInfo = { absolutePath: '', name: '', encryptedName: '' };
                customTypeInfo.absolutePath = key;
                let content = Utility_1.default.readFile(PrefabCodeBuilderConst_1.default.CUSTOM_TYPE_SEARCH_PATH + '/' + value);
                // 参考 _cclegacy._RF.push({}, "8bab18Kl3BDzL3yBG03VPfK", "FYUIComponent", undefined);
                let matchLine = content.match(/_cclegacy._RF.push\(.*\)/g);
                if (matchLine && matchLine.length > 0) {
                    // console.log("matchLine[0] = " + matchLine[0]);
                    let matchWords = matchLine[0].match(/"[^"]+",/g);
                    if (matchWords && matchWords.length >= 2) {
                        // console.log("matchWords[0] = " + matchWords[0]);
                        let matchEncrypted = matchWords[0].match(/[^",]+/g);
                        if (matchEncrypted && matchEncrypted.length > 0) {
                            // console.log("matchEncrypted[0] = " + matchEncrypted[0]);
                            customTypeInfo.encryptedName = matchEncrypted[0];
                            this._customTypeInfoMap[customTypeInfo.encryptedName] = customTypeInfo;
                        }
                        let matchCustomType = matchWords[1].match(/[^",]+/g);
                        if (matchCustomType && matchCustomType.length > 0) {
                            // console.log("matchCustomType[0] = " + matchCustomType[0]);
                            customTypeInfo.name = matchCustomType[0];
                            this._customTypeInfoMap[customTypeInfo.name] = customTypeInfo;
                        }
                    }
                }
            }
        }
    }
}
PrefabCodeBuilderPanel._genCount = 0;
PrefabCodeBuilderPanel._customTypeInfoMap = {};
exports.default = PrefabCodeBuilderPanel;
