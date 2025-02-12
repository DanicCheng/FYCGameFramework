import fs from 'fs';
import path from 'path';

export default class Utility {
    /** 
     * 创建目录
     * @param filePath 文件路径或者文件夹路径
     */
    public static createDirectory(filePath: string) {
        const arr = filePath.split('/');
        let dir = arr[0];
        for (let i = 1; i < arr.length; i++) {
            if (dir.length > 0 && !fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            dir = dir + '/' + arr[i];
        }
    }

    /** 
     * 目录与目录之间复制文件,两个参数要匹配,文件就是文件,文件夹就是文件夹
     * @param start 起始文件目录
     * @param end 目标文件目录
     */
    public static copyFile(start: string, end: string) {
        //如果目标文件夹不存在则需要创建文件夹
        if (!fs.existsSync(end)) {
            this.createDirectory(end)
        }

        //判断起始文件是文件还是目录
        let s = fs.statSync(start);
        if (s.isFile()) {
            // console.log("CustomPlugin: 拷贝文件", start, end)
            fs.writeFileSync(end, fs.readFileSync(start));
        } else {
            //读取目录中的所有文件,递归所有目录
            fs.readdirSync(start, "utf8").forEach(f => {
                this.copyFile(start + "/" + f, end + "/" + f);
            });
        }
    }

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
                if (extname !== '.meta' && extname !== '.DS_Store' && extname !== '') {
                    // 排除文件
                    filesList.push(fullPath);
                }
            }
        });
        return filesList;
    }

    /**
     * 读取文件
     * @param filePath 文件路径
     * @returns 
     */
    public static readFile(filePath: string) {
        return fs.readFileSync(filePath, { encoding: 'utf-8' });
    }

    /**
     * 写入文件
     * @param filePath 文件路径
     * @param data 数据
     */
    public static writeFile(filePath: string, data: string) {
        fs.writeFileSync(filePath, data);
    }

    /**
     * 校验目录，如果不存在，则创建
     * @param dir 目录
     * @returns 目录
     */
    public static checkDirectory(dir: string): string {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        return dir;
    }

    /**
     * 文件或目录是否存在
     * @param dir 目录
     * @returns 
     */
    public static isExist(dir: string): boolean {
        return fs.existsSync(dir)
    }

    /**
     * 以路径1为起点，获取路径2的相对路径
     * @param absolutePath1 绝对路径1
     * @param absolutePath2 绝对路径2
     */
    public static getRelativePath(absolutePath1: string, absolutePath2: string) {
        let len1 = absolutePath1.length;
        let len2 = absolutePath2.length;
        let len = len2;
        if (len1 > len2) {
            len = len1;
        }

        let tmpPath1 = absolutePath1.split('assets')[1];
        let tmpPath2 = absolutePath2.split('assets')[1];

        let endIndex = 0;
        for (let i = 0; i < len; i++) {
            if (tmpPath1[i] != tmpPath2[i]) {
                endIndex = i;
                break;
            }
        }

        tmpPath1 = tmpPath1.substring(endIndex);
        tmpPath2 = tmpPath2.substring(endIndex);
        // 参考 ../../../FYFramework/UI/FYUIViewBase
        let splits = tmpPath1.split('/');
        let newPath = '';
        for (let i = 0; i < splits.length - 1; i++) {
            newPath += '../';
        }

        return newPath + tmpPath2.replace('.ts', '');
    }

    /**
     * 异步读取目录下所有文件
     * @param path 目录路径
     * @param filesList 文件列表
     * @returns Promise<Array<string>>
     */
    public static async readFileListAsync(
        path: string, 
        filesList: Array<string> = [], 
        excludeExtensions: string[] = []
    ): Promise<Array<string>> {
        try {
            const fs = require('fs');
            const pathModule = require('path');
            const { promisify } = require('util');
            const readdir = promisify(fs.readdir);
            const stat = promisify(fs.stat);

            // 读取目录
            const files = await readdir(path);
            
            // 并行处理所有文件和目录
            await Promise.all(files.map(async (item: string) => {
                const fullPath = pathModule.join(path, item);
                const stats = await stat(fullPath);
                
                if (stats.isDirectory()) {
                    // 如果是目录，递归读取，传递排除列表
                    await this.readFileListAsync(fullPath, filesList, excludeExtensions);
                } else {
                    // 检查文件扩展名
                    const extname = pathModule.extname(fullPath);
                    if (!excludeExtensions.includes(extname)) {
                        filesList.push(fullPath);
                    }
                }
            }));

            return filesList;
        } catch (error) {
            console.error('读取目录失败:', error);
            return [];
        }
    }

    /**
     * 异步读取文件内容
     * @param path 文件路径
     * @returns Promise<string>
     */
    public static async readFileAsync(path: string): Promise<string> {
        const fs = require('fs');
        const { promisify } = require('util');
        const readFile = promisify(fs.readFile);

        try {
            const data = await readFile(path, 'utf8');
            return data;
        } catch (error) {
            console.error('读取文件失败:', error);
            throw error;
        }
    }

    /**
     * 异步写入文件
     * @param path 文件路径
     * @param content 文件内容
     */
    public static async writeFileAsync(path: string, content: string): Promise<void> {
        const fs = require('fs');
        const { promisify } = require('util');
        const writeFile = promisify(fs.writeFile);

        try {
            await writeFile(path, content, 'utf8');
        } catch (error) {
            console.error('写入文件失败:', error);
            throw error;
        }
    }
}