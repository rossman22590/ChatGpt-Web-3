<div align="center">
<img src="./src/assets/openai.svg" style="width:64px;height:64px;margin:0 32px" alt="icon"/>

<h1 align="center">ChatGPT Web</h1>

English / [简体中文](https://github.com/79E/ChatGpt-Web/blob/master/README-CN.md)

A commercially-viable ChatGpt web application built with React.

A commercial ChatGpt web application can be deployed.

[Issues](https://github.com/79E/ChatGPT-Web/issues) / [Buy Me a Coffee](https://www.buymeacoffee.com/beggar) / [sponsor me](https://files.catbox.moe/o0znrg.JPG)

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/79E/ChatGpt-Web)

</div>

## 🐶 Demonstrate
### Page link
[Web Demonstration: https://www.aizj.top/](https://www.aizj.top/)

[Admin Demonstration: https://www.aizj.top/admin](https://www.aizj.top/admin)

如需帮助请提交 [Issues](https://github.com/79E/ChatGPT-Web/issues) 或赞赏时留下联系方式。

### Page screenshot

![cover](https://files.catbox.moe/tp963e.png)
![cover](https://files.catbox.moe/y5avbx.png)
![cover](https://files.catbox.moe/k16jsz.png)
![cover](https://files.catbox.moe/8o5oja.png)

## 🤖 The main function

- The background management system can be managed to manage users, token, goods, card secrets, etc.
- Carefully designed UI, responding design
- Extremely fast first screen loading speed（~100kb）
- Support MIDJOURNEY painting and DallE model painting, GPT4 and other applications
- Massive built-in Prompt list，From [Chinese](https://github.com/PlexPt/awesome-chatgpt-prompts-zh)[English](https://github.com/f/awesome-chatgpt-prompts)
- One-click export chat record, complete Markdown support
- Support custom API address（like：[openAI](https://api.openai.com) / [API2D](https://api2d.com/r/192767)）

## 🎮 start using
**Node environment**

`node` need `^16 || ^18 || ^19` Version（node >= 16.19.0），You can use NVM to manage multiple local Node versions.

```
# View node version
node -v

# View NPM version
npm -v

# View yarn version
yarn -v

```

**1.First `Fork` This project，Then cloned to the local area.**
```
git clone https://github.com/79E/ChatGpt-Web.git
```

**2.Installation dependency**
```
yarn install
```

**3.run**
```
# web Project begining
yarn dev:web
```

**4.Pack**
```
yarn build
```

## ⛺️ Environment variable

> Most of the configuration items in this project are set through environmental variables.

#### `VITE_APP_REQUEST_HOST` 

Request the `host` address of the service side.

#### `VITE_APP_TITLE` 

Chat Web Title name.

#### `VITE_APP_LOGO` 

Chat Web Logo。

## 🚧 Develop

> It is strongly not recommended to develop or deploy locally. Due to some technical reasons, it is difficult to configure the OpenAI API agent locally unless you can guarantee that you can directly connect the Openai server.

#### Local development

1. For the specific details of Nodejs and Yarn, please ask ChatGPT
2. Just execute `yarn install`
3. web project development `yarn dev: web`
4. Server project development `yarn dev`
5. Packing item `yarn build`

#### Server

1. The front -end request server [interface document](https://console-docs.apipost.cn/preview/38826c52f656ef05/044846bd536b67bb) You can develop according to this interface documentation
2. If you need help, please submit [Issues](https://github.com/79E/ChatGPT-Web/issues) Or leave contact information when appreciated.

## 🎯 deploy
> Just upload the `DIST` directory that the` web` item is wrapped to the server. Pay attention to the server IP address location!

### Vercel
If you host it on your Vercel server, click the deploy button to start your deployment!
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/79E/ChatGpt-Web)

If you need help, please submit [Issues](https://github.com/79E/ChatGPT-Web/issues) Or leave contact information when appreciated.

## 🧘 Contributor

[See the list of project contributors](https://github.com/79E/ChatGPT-Web/graphs/contributors)

## 📋 Open source protocol

[![License MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://github.com/79E/ChatGpt-Web/blob/master/license)
