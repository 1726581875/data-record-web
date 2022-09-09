/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
let baseUrl = '';
let routerMode = 'hash';
let baseImgPath;


console.log("process.env.NODE_ENV=" + process.env.NODE_ENV);
if (process.env.NODE_ENV == 'development') {
	baseUrl = 'http://159.75.134.161:10000/apis';
    baseImgPath = '/img/';
} else {
	baseUrl = 'http://127.0.0.1:9898';
    baseImgPath = '//elm.cangdu.org/img/';
}

baseUrl = 'http://localhost:9898';

export {
	baseUrl,
	routerMode,
	baseImgPath
}
