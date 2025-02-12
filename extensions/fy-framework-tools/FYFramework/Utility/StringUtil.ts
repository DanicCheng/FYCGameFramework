/**
 * 校验地址是否为http或https
 */
String.prototype['isHttpURL'] = function () {
    let isHttp = /^http[s]*:\/\//;
    return isHttp.test(this);
}

/**
 * 判断字符是否为空
 */
String.prototype['isNullOrEmpty'] = function () {
    return this === null || this === undefined || this === '';
}

/**
 * 限制为n个字符，超过的显示... 中文占两个字符
 * @param n 
 */
String.prototype['limitLength'] = function (n: number) {
    let strLength = 0;
    let cutIndex = 0;
    for (let i = 0; i < this.length; i++) {
        if (strLength >= n && cutIndex == 0) {
            cutIndex = i;
        }
        if (escape(this[i]).indexOf("%u") < 0) //不是中文
        {
            strLength += 1;
        }
        else //中文
        {
            strLength += 2;
        }
    }

    //如果字符长度小于截取长度，直接返回
    if (strLength <= n) {
        return this
    }

    let finalStr = this.slice(0, cutIndex) + '...';
    return finalStr
}

/**
 * 格式化字符串
 * 例如：
 * const message = ''.format("Hello, my name is {0} and I am {1} years old.", name, age);
 * @param template 字符串模板
 * @param args 参数
 */
String.prototype['format'] = function (template: string, ...args: any[]) {
    return template.replace(/{(\d+)}/g, (match, index) => {
        return typeof args[index] !== 'undefined' ? args[index] : match;
    });
}

/**
 * 在字符串的末尾添加指定的填充字符，直到字符串达到指定的最小长度
 * @param targetLength 目标字符串的最小长度。如果原字符串的长度小于 targetLength，则会在原字符串的末尾添加填充字符，直到字符串达到 targetLength 长度。
 * @param padString 用于填充的字符串。如果原字符串的长度小于 targetLength，则会使用 padString 中的字符从左到右依次填充到原字符串的末尾，直到字符串达到 targetLength 长度。如果 padString 的长度不足以使原字符串达到 targetLength，则 padString 会重复使用，直到达到目标长度。
 */
String.prototype['padEnd'] = function (targetLength: number, padString: string): string {
    const str = this.valueOf();
    const padding = Array(targetLength - str.length + 1).join(padString);
    return str + padding.slice(0, targetLength - str.length);
};

/**
 * 在字符串的开头添加指定的填充字符，直到字符串达到指定的最小长度
 * @param targetLength 目标字符串的最小长度。
 * @param padString 用于填充的字符串。
 */
String.prototype['padStart'] = function (targetLength: number, padString: string = ' '): string {
    const str = this.valueOf();
    const diff = targetLength - str.length;
    if (diff > 0) {
        const pad = padString.repeat(Math.ceil(diff / padString.length)).slice(0, diff);
        return pad + str;
    }
    return str;
};

export { }