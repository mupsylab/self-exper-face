# Vue + TypeScript + jsPsych Framework

A framework for psychological behavioral experiments built with Vue, TypeScript, and jsPsych. This framework supports running experiments either online or as standalone systems. It is designed for flexibility and scalability, making it suitable for a wide range of research needs.

## Features

- **Modern Frontend**: Built with Vue.js and TypeScript for a clean, maintainable codebase.
- **Integrated jsPsych**: Seamlessly integrates jsPsych for building and managing psychological experiments.
- **Flexible Deployment**: Supports both:
  - Online deployment (via a Node.js server).
  - Standalone execution as a packaged application.
- **Efficient Build Process**: Includes a Node.js-based pipeline for compiling and packaging experiments.

## Installation

Before starting, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/mupsylab/jspsych-template-v2.git
cd jspsych-template-v2
```

### Step 2: Install Dependencies

```bash
npm install
```

## Usage

### Development Mode

Run the application in development mode to build and test experiments locally.

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Online Deployment

To compile and bundle the project for online deployment:

```bash
npm run build
```

The `dist/` folder will contain optimized static files that can be uploaded to any web server or platform.

### Build Executable Files

Generate standalone executable files for local execution:

```bash
npm run pack:win
npm run pack:mac
```

Choose the appropriate command based on your operating system (Windows or macOS).

## License

This project is licensed under the [MIT License](License.txt).

## Acknowledgments
- [Vue.js](https://vuejs.org/)
- [jsPsych](https://www.jspsych.org/)
- [TypeScript](https://www.typescriptlang.org/)