export class Dictionary<T> {
    private items: { [key: string | number]: T } = {};

    constructor() {
        return new Proxy(this, {
            get: (target, prop: string | number | symbol): T => {
                if ((typeof prop === "string" || typeof prop === 'number') && prop in target.items) {
                    return target.items[prop];
                }
                return (target as any)[prop];
            },
            set: (target, prop: string | symbol, value: any) => {
                if (typeof prop === "string" || typeof prop === 'number') {
                    target.items[prop] = value;
                    return true;
                }
                (target as any)[prop] = value;
                return true;
            }
        });
    }

    /**
     * 添加
     * @param key 关键字
     * @param value 数值
     */
    public add(key: string | number, value: T): void {
        this.items[key] = value;
    }

    /**
     * 移除
     * @param key 关键字
     * @returns 
     */
    public remove(key: string | number): boolean {
        if (this.items.hasOwnProperty(key)) {
            delete this.items[key];
            return true;
        }
        return false;
    }

    /**
     * 获取
     * @param key 关键字
     * @returns 
     */
    public get(key: string | number): T | undefined {
        return this.items[key];
    }

    /**
     * 设置
     * @param key 关键字
     * @param value 数值
     */
    public set(key: string | number, value: T) {
        this.items[key] = value;
    }

    /**
     * 是否包含
     * @param key 关键字
     * @returns 
     */
    public contains(key: string | number): boolean {
        return this.items.hasOwnProperty(key);
    }

    /**
     * 所有关键字
     * @returns 
     */
    public keys(): string[] {
        return Object.keys(this.items);
    }

    /**
     * 清空字典
     */
    public clear(): void {
        this.items = {};
    }

    /**
     * 字典长度
     * @returns 
     */
    public length(): number {
        return Object.keys(this.items).length;
    }

    // 打印字典内容（递归）
    public print(indent: string = ''): void {
        for (const key in this.items) {
            if (this.items.hasOwnProperty(key)) {
                const value = this.items[key];
                if (value instanceof Dictionary) {
                    console.log(`${indent}${key}:`);
                    value.print(indent + '  '); // 递归打印嵌套的字典
                } else {
                    console.log(`${indent}${key}: ${value}`);
                }
            }
        }
    }
}
