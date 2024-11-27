declare const browser = "Chrome" | "Chromium" | "IE" | "Edge" | "Firefox" | "Safari" | "Opera" | "Opera" | "Vivaldi" | "Yandex" | "Brave" | "Arora" | "Lunascape" | "QupZilla" | "Coc" | "Kindle" | "Iceweasel" | "Konqueror" | "SeaMonkey" | "Epiphany" | "Headless" | "360" | "360SE" | "360EE" | "360AI" | "360ENT" | "UC" | "QQBrowser" | "Baidu" | "Maxthon" | "Sogou" | "Liebao" | "2345Explorer" | "115Browser" | "TheWorld" | "Qiyu" | "Quark" | "Huawei" | "HONOR" | "OPPO" | "Vivo" | "Xiaomi" | "Meizu" | "OnePlus" | "Samsung" | "Lenovo" | "QQ" | "Wechat" | "WechatWork" | "Taobao" | "Alipay" | "Weibo" | "Douban" | "Suning" | "iQIYI" | "DingTalk" | "Douyin" | "Toutiao" | "Googlebot" | "Baiduspider" | "Sogouspider" | "Bingbot" | "360Spider" | "Bytespider" | "YisouSpider" | "YodaoBot" | "YandexBot"; 
declare const engine = "EdgeHTML" | "Trident" | "Presto" | "Webkit" | "Blink" | "Gecko" | "Servo" | "KHTML";
declare const system = "Windows" | "Linux" | "Ubuntu" | "FreeBSD" | "Debian" | "macOS" | "Android" | "iOS" | "Windows Phone" | "BlackBerry" | "MeeGo" | "Symbian" | "Chrome OS" | "WebOS" | "HarmonyOS";
declare const device = "Desktop" | "Tablet" | "Moblie";
declare const platform = "Win32" | "Win64" | "WinCE" | "iPhone" | "iPod" | "iPad" | "Android";

declare const keys = "browser" | "browserVersion" | "engine" | "system" | "systemVersion" | "platform" | "screenFPS" | "screenWidth" | "screenHeight" | "clientWidth" | "clientHeight" | "device" | "devicePixelRatio" | "deviceMemory" | "architecture" | "bitness" | "gpu" | "gpuModel" | "ip" | "language" | "network" | "timezone" | "isWebview" | "isBot" | "isTouch" | "userAgent";
interface browserInfo {
    browser?: browser,             // 浏览器名称
    browserVersion?: string,       // 浏览器版本
    engine?: engine,               // 浏览器渲染引擎
    system?: system,               // 操作系统名称
    systemVersion?: string,        // 操作系统版本
    platform?: platform,           // 系统平台
    screenFPS?: number,            // 屏幕刷新率
    screenWidth?: number,          // 屏幕宽度
    screenHeight?: number,         // 屏幕高度
    clientWidth?: number,          // 浏览器可视区域宽度
    clientHeight?: number,         // 浏览器可视区域高度
    device?: device,               // 设备类型
    devicePixelRatio?:number,      // 设备分辨率比
    deviceMemory?:number,          // 设备大致内存大小
    architecture?: string,         // 芯片架构
    bitness?: number,              // CPU架构位数
    gpu?: string,                  // GPU厂商
    gpuModel?: string,             // GPU型号
    ip?: string,                   // IP地址
    language?: string,             // 所用语言
    network?: string,              // 网络类型
    timezone?: string,             // 所处时区
    isWebview?: boolean,           // 是否Webview(仅Android有效)
    isBot?: boolean,               // 是否搜索引擎蜘蛛程序
    isTouch?: boolean,             // 是否为触屏
    userAgent?: string
}


declare module 'browser-tool' {
    function getInfo(): Promise<Dictionary>
}