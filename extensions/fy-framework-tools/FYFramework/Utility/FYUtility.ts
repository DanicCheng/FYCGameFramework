//#region ------------------ Number 扩展 ------------------

export default class FYUtility {
    /**
     * 获取不重复的随机数
     * @param minValue 最小值
     * @param maxValue 最大值
     * @param valueNum 随机个数
     */
    static getRandomValueDif(minValue: number, maxValue: number, valueNum: number) {
        // 全部随机数值  
        let allNums = new Array();

        // 判断获取随机数个数  
        let size = valueNum ? (valueNum > maxValue - minValue + 1 ? maxValue - minValue + 1 : valueNum) : 1;

        // 生成随机数值区间数组  
        for (let i = minValue, k = 0; i <= maxValue; i++, k++) {
            allNums[k] = i;
        }

        let arr = []

        // 随机从数组里面取值
        allNums.sort(function () { return 0.5 - Math.random(); });
        for (let j = 0; j < size; j++) {
            let index = Math.floor(Math.random() * allNums.length);
            arr.push(allNums[index]);
            let tmp = allNums[index];
            allNums[index] = allNums[allNums.length - 1];
            allNums[allNums.length - 1] = tmp;
            allNums.pop();
        }

        return arr;
    }

    /**
     * 获取范围内的随机数
     * @param minValue 最小值
     * @param maxValue 最大值
     */
    static getRangeRandom(minValue: number, maxValue: number) {
        if (minValue === maxValue) {
            return minValue;
        }
        return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    }

    /**
     * 获取最大值 0 和 最大值 都可以取到
     * @param maxValue 最大值
     */
    static getRandom(maxValue: number) {
        return Math.floor(Math.random() * maxValue);
    }

    /**
     * 获取类对象的类名 仅适用于cocos的component
     * @param instance 类对象
     * @returns 
     */
    static getClassInstanceName(instance): string {
        if (!instance) {
            return '';
        }

        return instance.__classname__;
    }

    /**
     * 获取类名 仅适用于cocos的component
     * @param cls 类
     * @returns 
     */
    static getClassName(cls: { new() }): string {
        return new cls().__classname__;
    }

    /**
     * 获取模块名
     * @param cls 模块类
     * @returns 
     */
    static getModuleName(cls): string {
        return cls.clsName;
    }

    /**
     * 获取预制名
     * @param Ctor 预制类
     * @returns 
     */
    static getPrefabName(Ctor): string {
        return Ctor.prefabName;
    }

    /**
     * 获取枚举的键名
     * @param enumObj 枚举对象
     * @returns 
     */
    static getEnumKeys(enumObj: any): Array<string> {
        return Object.keys(enumObj).filter(key => isNaN(Number(key)));
    }

    /**
     * 通过枚举的值获取枚举的键名
     * @param enumObj 枚举对象
     * @param value 枚举关键字对应的值
     * @returns 
     */
    static getEnumKeyByEnumValue(enumObj: any, value: number): string {
        for (const key in enumObj) {
            if (enumObj[key] === value && isNaN(Number(key))) {
                return key;
            }
        }
        return '';
    }

    /**
     * 根据枚举的键名获取枚举值
     * @param enumObj 枚举对象
     * @param keyName 键名
     * @returns 
     */
    static getEnumValueByEnumKey(enumObj: any, keyName: string): any {
        for (const key in enumObj) {
            if (key == keyName) {
                return enumObj[key];
            }
        }

        return '';
    }

    /**
     * 是空，未定义或者空字符串
     * @param value 对象
     * @returns 
     */
    static isNullOrEmpty(value: any): boolean {
        return value === undefined || value === null || value === '';
    }

    /**
     * 对象是否有效
     * @param value 对象
     * @returns 
     */
    static isValid(value: any): boolean {
        return value !== undefined && value !== null && value !== '';
    }

    /**
     * 获取字典长度
     * @param dictionary 字典
     * @returns 
     */
    static getDictionaryLength(dictionary: { [key: string]: any }): number {
        return Object.keys(dictionary).length;
    }
}
