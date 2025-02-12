declare module "cc" {
    interface Node {
        /**
         * 重置 位置归零，旋转归零，缩放归一
         */
        reset: () => void;

        /**
         * 添加子对象扩展方法，会实例化一个新的子对象
         * @param child 子对象
         * @returns 返回新的子对象
         */
        addChildEx: (child: Node) => Node;

        /**
         * 设置X坐标
         * @param x X坐标
         * @returns 
         */
        setPositionX: (x: number) => void;

        /**
         * 设置Y坐标
         * @param y Y坐标
         * @returns 
         */
        setPositionY: (y: number) => void;

        /**
         * 设置Z坐标
         * @param z Z坐标
         * @returns 
         */
        setPositionZ: (z: number) => void;
    }
}