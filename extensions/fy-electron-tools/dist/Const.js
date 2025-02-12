"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Const {
}
/**
 * 临时文件路径
 */
Const.TEMP_PATH = Editor.Project.path + '/temp';
/**
 * 该插件的临时文件路径
 */
Const.TEMP_DATA_PATH = Const.TEMP_PATH + '/fy-electron-tools';
/**
 * 该插件的临时文件
 */
Const.TEMP_DATA_FILE = Const.TEMP_DATA_PATH + '/data.json';
/**
 * 项目默认名
 */
Const.PROJECT_NAME_DEFAULT = 'Electron';
/**
 * 项目版本默认值
 */
Const.PROJECT_VERSION_DEFAULT = '1.0.0';
/**
 * 作者默认值
 */
Const.AUTHOR_DEFAULT = 'foryun';
/**
 * web项目默认文件名
 */
Const.WEB_NAME_DEFAULT = 'web-mobile';
/**
 * 输出项目默认文件名
 */
Const.OUTPUT_NAME_DEFAULT = 'electron';
/**
 * 输出项目临时文件名
 */
Const.OUTPUT_NAME_TEMP_DEFAULT = 'electron-temp';
/**
 * 默认Steam APP ID
 */
Const.STEAM_APP_ID_DEFAULT = '480';
/**
 * 项目名
 */
Const.KEY_PROJECT_NAME = 'ProjectName';
/**
 * 项目版本
 */
Const.KEY_PROJECT_VERSION = 'ProjectVersion';
/**
 * 作者
 */
Const.KEY_AUTHOR = 'Author';
/**
 * Web项目路径
 */
Const.KEY_WEB_PATH = 'WebPath';
/**
 * 输出目录
 */
Const.KEY_OUTPUT_PATH = 'OutputPath';
/**
 * 图标目录
 */
Const.KEY_ICON_PATH = 'IconPath';
/**
 * steam appid
 */
Const.KEY_STEAM_APP_ID = 'SteamAppId';
/**
 * 是否steam
 */
Const.KEY_IS_STEAM = 'IsSteam';
/**
 * 项目构建路径
 */
Const.BUILD_PATH = Editor.Project.path + '/build';
/**
 * Json文件前缀
 */
Const.JSON_NAME_PRE = 'CFG_';
/** 脚本模板路径 */
Const.TEMPLATE_PATH = Editor.Project.path + '/extensions/fy-electron-tools/template';
/** 模板替换关键字 */
Const.TEMPLATE_REPLACE_KEY_WEB_URL = '$KEY_WEB_URL';
/** 作者 */
Const.TEMPLATE_REPLACE_KEY_AUTHOR = '$KEY_AUTHOR';
/** 项目名 */
Const.TEMPLATE_REPLACE_KEY_PROJECT_NAME = '$KEY_PROJECT_NAME';
/** 项目版本 */
Const.TEMPLATE_REPLACE_KEY_PROJECT_VERSION = '$KEY_PROJECT_VERSION';
/** 图标 */
Const.TEMPLATE_REPLACE_KEY_ICON = '$KEY_ICON';
/** STEAM的appid */
Const.TEMPLATE_REPLACE_KEY_STEAM_APP_ID = '$KEY_STEAM_APP_ID';
exports.default = Const;
