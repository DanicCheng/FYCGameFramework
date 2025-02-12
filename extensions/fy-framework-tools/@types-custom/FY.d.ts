/**
 * FY框架的扩展
 */

//#region ------------------ Number 扩展 ------------------

/**
 * 在NumberUtil.ts里面实现
 */
interface Number {
	/**
	 * 用缩写的方式显示数字 大于1000 用K 大于1000000 用M
	 */
	toAbbreviation: () => string;
}

//#endregion

//#region ------------------ String 扩展 ------------------

/**
 * 在StringUtil.ts里面实现
 */
interface String {
	/**
	 * 校验地址是否为http或https
	 */
	isHttpURL: () => boolean;
	/**
	 * 判断字符是否为空
	 */
	isNullOrEmpty: () => boolean;
	/**
	 * 限制为n个字符，超过的显示... 中文占两个字符
	 * @param n 限制为几个字符
	 */
	limitLength: (n: number) => string;

	/**
	 * 格式化字符串
	 * 例如：
	 * const message = ''.format("Hello, my name is {0} and I am {1} years old.", name, age);
	 * @param template 字符串模板
	 * @param args 参数
	 */
	format: (template: string, ...args: any[]) => string;

	/**
	 * 在字符串的末尾添加指定的填充字符，直到字符串达到指定的最小长度
	 * @param targetLength 目标字符串的最小长度。如果原字符串的长度小于 targetLength，则会在原字符串的末尾添加填充字符，直到字符串达到 targetLength 长度。
	 * @param padString 用于填充的字符串。如果原字符串的长度小于 targetLength，则会使用 padString 中的字符从左到右依次填充到原字符串的末尾，直到字符串达到 targetLength 长度。如果 padString 的长度不足以使原字符串达到 targetLength，则 padString 会重复使用，直到达到目标长度。
	 */
	padEnd(targetLength: number, padString: string): string;

	/**
	 * 在字符串的开头添加指定的填充字符，直到字符串达到指定的最小长度
	 * @param targetLength 目标字符串的最小长度。
	 * @param padString 用于填充的字符串。
	 */
	padStart(targetLength: number, padString: string): string;
}

//#endregion

//#region ------------------ Array 扩展 ------------------

/**
 * 在ArrayUtil.ts里面实现
 */
interface Array<T> {
	/**
	 * 拷贝数组
	 */
	copy: () => Array<T>;
	/**
	 * 是否含有指定值
	 */
	contain: (v: T) => boolean;
	/**
	 * 从数组中移除指定数据
	 * @param v 
	 */
	remove: (v: T) => void;
}

//#endregion