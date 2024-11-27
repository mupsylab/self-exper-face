# 基于 Vue + TypeScript + jsPsych 的心理学行为实验框架

这是一个用于心理学行为实验的框架，基于 Vue、TypeScript 和 jsPsych 构建。框架支持线上部署或作为独立系统运行，为研究人员提供灵活、高效的实验构建方式。

## 特性
- **现代前端技术**：基于 Vue.js 和 TypeScript，代码清晰易维护。
- **魔改 jsPsych**：内置魔改jsPsych，支持快速构建和管理心理学实验。
- **灵活部署**：支持以下两种运行模式：
  - 线上部署：通过 Node.js 构建并发布到服务器。
  - 独立模式：生成压缩包，可本地运行。
- **高效打包流程**：提供基于 Node.js 的编译和打包工具。

## 安装
在开始之前，请确保您的系统已安装以下环境：

- [Node.js](https://nodejs.org/) (版本 16 或更高)
- [npm](https://www.npmjs.com/) 或 [yarn](https://yarnpkg.com/)

### 第一步：克隆项目
```bash
git clone https://github.com/mupsylab/jspsych-template-v2.git
cd jspsych-template-v2
```

### 第二步：安装依赖
```bash
npm install
```

## 使用

### 开发者模式
在开发模式下运行项目，可以本地测试和调试实验：

```bash
npm run dev
```

运行后，应用将在`http://localhost:5173`访问。

### 线上部署
将项目编译并打包用于先上部署：
```bash
npm run build
```
生成的`dist/`文件夹包含优化后的静态文件，可上传到任意 Web 服务器或平台运行。

### 构建可执行文件
将项目构建为独立运行的可执行文件
```bash
npm run pack:win
npm run pack:mac
```
请自行依据你的系统版本选择合适的命令打包项目。

## 贡献
如果您在使用中遇到问题或有改进建议，请通过 `Issues` 提交反馈，或直接提交 `Pull Request`。

## 致谢
- [Vue.js](https://vuejs.org/)
- [jsPsych](https://www.jspsych.org/)
- [TypeScript](https://www.typescriptlang.org/)