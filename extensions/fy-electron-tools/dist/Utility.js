"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const Const_1 = __importDefault(require("./Const"));
const path_1 = __importDefault(require("path"));
/**
 * 工具类
 */
class Utility {
    /**
     * 递归获取目录下所有文件
     * @param dir 目录
     * @param filesList 文件列表
     * @returns 文件列表
     */
    static readFileList(dir, filesList = []) {
        const files = fs_1.default.readdirSync(dir);
        files.forEach((item, index) => {
            var fullPath = path_1.default.join(dir, item);
            const stat = fs_1.default.statSync(fullPath);
            if (stat.isDirectory()) {
                Utility.readFileList(path_1.default.join(dir, item), filesList); //递归读取文件
            }
            else {
                let extname = path_1.default.extname(fullPath);
                if ((extname === '.xls' || extname === '.xlsx') && !item.startsWith('.') && !item.startsWith('_') && !item.startsWith('~$')) {
                    // 排除文件
                    filesList.push(fullPath);
                }
            }
        });
        return filesList;
    }
    /**
    * 校验目录，如果不存在，则创建
    * @param dir 目录
    * @returns 目录
    */
    static checkDirectory(dir) {
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir);
        }
        return dir;
    }
    /**
     * 保存
     * @param key 关键字
     * @param value 值
     */
    static save(key, value) {
        this.checkDirectory(Const_1.default.TEMP_PATH);
        this.checkDirectory(Const_1.default.TEMP_DATA_PATH);
        let data = {};
        if (fs_1.default.existsSync(Const_1.default.TEMP_DATA_FILE)) {
            let raw = fs_1.default.readFileSync(Const_1.default.TEMP_DATA_FILE, 'utf-8');
            data = JSON.parse(raw);
        }
        if (!data) {
            data = {};
        }
        data[key] = value;
        fs_1.default.writeFileSync(Const_1.default.TEMP_DATA_FILE, JSON.stringify(data));
    }
    /**
     * 读取
     * @param key 关键字
     * @returns
     */
    static load(key) {
        this.checkDirectory(Const_1.default.TEMP_PATH);
        this.checkDirectory(Const_1.default.TEMP_DATA_PATH);
        let data = {};
        if (fs_1.default.existsSync(Const_1.default.TEMP_DATA_FILE)) {
            let raw = fs_1.default.readFileSync(Const_1.default.TEMP_DATA_FILE, 'utf-8');
            data = JSON.parse(raw);
        }
        return data[key] || '';
    }
}
/** 原始配置大小 */
Utility.originalConfigSize = 0;
/** 压缩后配置大小 */
Utility.compressConfigSize = 0;
exports.default = Utility;
