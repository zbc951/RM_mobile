# jyufu_mobile
大球-YUN-FU 手機版前端

## 目前框架版本
* Angular    ~4.2.0
* TypeScript ~2.4.0
* Webpack    ~3.2.0

## 專案目錄
* config            - Webpack 設定資料夾
* src               - 程式原始碼資料夾
* .gitignore        - Git 忽略版控的項目設定
* package.json      - npm 安裝包設定
* README.md         - 專案說明文件
* tsconfig.json     - TypeScript 設定檔
* webpack.config.js - Webpack Dev Server 載入點

## src 目錄配置
* app   - 元件庫
* css   - 全局 CSS
* img   - 圖片
* file  - JSON 文件
* js    - JavaScript 程式庫
    * config.js  - 快速設定檔
    * plugins.js - plugins
* lib   - TypeScript 程式庫
    * config.ts    - 為 config.js 增添型別資訊
    * function.ts  - 函式庫
    * IResponse.ts - Interface 庫
* service - 服務
    * api.service.ts        - API HTTP Request
    * member.service.ts     - 會員資料管理 服務
    * language.service.rs   - 語系對照 服務
    * loading.service.rs    - 讀取畫面 服務
    * auth-guard.service.ts - Router 驗證 uid 服務
* index.html  - 索引網頁
* main.ts     - app 載入點
* polyfill.ts - Polyfills


## app 元件配置
* _login           - 登入頁
* _footer          - 頁尾
* market           - 市場列表
    * m-sort       - 列表分類(視窗)
    * handicap     - 賽事盤口
        * bet      - 下注(視窗)
        * b-record - 對戰紀錄(視窗)
* detail        - 下注明細
* history       - 歷史帳務
    * h-detail  - 單日明細
* billboard     - 公告
* boxsource     - 比賽結果
* promote       - 推廣連結
* feedback      - 問題回報
* manual        - 系統規則
* cash          - 充值提領
    * deposit   - 存款
    * withdraw  - 提款
    * bankcard  - 銀行卡
    * record    - 交易紀錄
* modify        - 修改個資
* option        - 更多選項


## npm 安裝包配置
### - dependencies (生產環境)
* Angular
    * @angular/core                         - Component、Directive、依賴注入系統(DI)、生命週期鉤子
    * @angular/common                       - Services、Pipes
    * @angular/compiler                     - Angular 的模板編譯器。透過 platform-browser-dynamic 間接使用它
    * @angular/platform-browser             - DOM 與 browsers 相關的每樣東西，特別是幫助往 DOM 渲染的部分
    * @angular/platform-browser-dynamic     - 為 app 提供 providers 和 bootstrap 方法 (app.module.ts)
    * @angular/http                         - HTTP
    * @angular/router                       - Router
    * @angular/animations                   - Animations
* Libraries
    * rxjs                                  - ReactiveX JavaScript
* Polyfills
    * core-js                               - Window BOM 的 Polyfill，提供了 ES6 的很多基礎特性
    * zone.js                               - 為 JavaScript 提供了執行上下文，在異步任務之間持久性傳遞
    * intl                                  - 格式化字串、時間、數字API
    * web-animations-js                     - @angular/animations 的 Polyfill
* Plugins
    * angular2-qrcode                       - QR Code 生成器
    * ngx-clipboard                         - 複製到剪貼簿功能
    * ng2-scroll-to                         - Scroll 便捷操作

### - devDependencies (開發工具)
* Angular
    * @angular/compiler-cli
* Sass
    * node-sass
* TypeScript
    * typescript            - TypeScript 編譯器 tsc
    * @types/*              - 讓 TypeScript 能看懂 Libraries 及 Polyfills 的類型聲明文件
* Webpack
    * webpack             - 打包工具
    * webpack-dev-server  - 小型的 Node.js Express Server
    * webpack-merge       - 合併多個 webpack config 檔
    * xxx-loader          - 使 Webpack 能看懂 JavaScript 以外的文件
        * file-loader       - 讀取檔案(如圖片) 返回對應的 url
        * html-loader       - HTML 返回 字串
        * raw-loader        - 文件 返回 字串
        * sass-loader       - 解讀 SASS 返回 CSS
        * css-loader        - 讀取 CSS 返回對應 import
        * style-loader      - 解讀 CSS 返回 <style></style> 語法
        * angular2-template-loader  -   讀取 Angular Template
        * awesome-typescript-loader -   讀取 TypeScript 文件
    * xxx-plugin          - 為 Webpack 增添功能的套件
        * copy-webpack-plugin           - 剪下貼上文件
        * extract-text-webpack-plugin   - 將內部文件提取至外部，與 HtmlWebpackPlugin 配合
        * html-webpack-plugin           - 將文件插入到 index.html
        * autoprefixer                  - 自動為 CSS 加上供應商前綴
    * @ngtools/webpack    - Webpack AOT 套件


    更新19/02/21

說明補釘安裝*canvas

如果您使用的是Windows，則可以node-gyp使用單個命令安裝所有依賴項（注意：在Windows PowerShell中運行為管理員)

執行
```bash
  $ npm install --global --production windows-build-tools  
```
And then install the package
```bash
  $ npm install --global node-gyp  
```
您將需要捆綁在GTK中的cairo庫。下載適用於Win32或Win64的GTK 2軟件包。解壓縮內容C:\GTK。
http://ftp.gnome.org/pub/GNOME/binaries/win64/gtk+/2.22/gtk+-bundle_2.22.1-20101229_win64.zip


And then install the package(在專案內)
```bash
  npm install canvas  
```

"rxjs": "^5.4.2",


改代理伺服器

jyufu-mobile\config\webpack.dev

改target:路由位子
***
    devServer: {
        historyApiFallback: true,
        stats: 'minimal',
        proxy: {
            '/pub/gateway.php': {
                target: 'http://big59-web.sog88.net',
                secure: false,
                changeOrigin: true //webpack@1.14.1 以上
            }
        }
    }
***
