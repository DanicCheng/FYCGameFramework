import fs from 'fs';
import Const from './Const';
import path from 'path';

/**
 * 工具类
 */
export default class Utility {
    /** 原始配置大小 */
    public static originalConfigSize = 0;
    /** 压缩后配置大小 */
    public static compressConfigSize = 0;
    /**
     * 递归获取目录下所有文件
     * @param dir 目录
     * @param filesList 文件列表
     * @returns 文件列表
     */
    public static readFileList(dir: string, filesList: Array<string> = []): Array<string> {
        const files = fs.readdirSync(dir);
        files.forEach((item, index) => {
            var fullPath: string = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                Utility.readFileList(path.join(dir, item), filesList);  //递归读取文件
            } else {
                let extname = path.extname(fullPath);
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
    public static checkDirectory(dir: string) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        return dir;
    }

    /**
     * 保存
     * @param key 关键字
     * @param value 值
     */
    public static save(key: string, value: string) {
        this.checkDirectory(Const.TEMP_PATH);
        this.checkDirectory(Const.TEMP_DATA_PATH);

        let data: { [key: string]: string } = {};
        if (fs.existsSync(Const.TEMP_DATA_FILE)) {
            let raw = fs.readFileSync(Const.TEMP_DATA_FILE, 'utf-8');
            data = JSON.parse(raw);
        }

        if (!data) {
            data = {};
        }

        data[key] = value;
        fs.writeFileSync(Const.TEMP_DATA_FILE, JSON.stringify(data));
    }

    /**
     * 读取
     * @param key 关键字
     * @returns 
     */
    public static load(key: string): string {
        this.checkDirectory(Const.TEMP_PATH);
        this.checkDirectory(Const.TEMP_DATA_PATH);

        let data: { [key: string]: string } = {};
        if (fs.existsSync(Const.TEMP_DATA_FILE)) {
            let raw = fs.readFileSync(Const.TEMP_DATA_FILE, 'utf-8');
            data = JSON.parse(raw);
        }

        return data[key] || '';
    }
}