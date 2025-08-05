# Dreamify - Free AI Art Generator Online | One-Click Anime, Illustration, and Art Creation

![Dreamify Logo](https://dreamify.slmnb.cn/images/dreamify-logo.jpg)

> **Dreamify** 是一个基于 **Next.js** 与 **ComfyUI API** 的开源 AI 图像生成平台，支持文生图（Text-to-Image）和图生图（Image-to-Image），无需注册、完全免费，专为开发者与创意者打造。

---

## 🚀 项目简介

Dreamify 是一个轻量级、高性能的 AI 绘画网站模板，集成多种先进 AI 模型（如 **HiDream-I1**、**Flux.1-Dev**、**Stable Diffusion 3.5** 等），通过调用 ComfyUI 后端 API 实现秒级图像生成。项目采用现代 Web 技术栈构建，开箱即用，适合快速部署个人 AI 创作平台或作为二次开发模板。

无论你是设计师、开发者还是 AI 艺术爱好者，Dreamify 都能让你在 10 秒内将创意变为现实。

---

## ✨ 核心特性

| 特性 | 说明 |
|------|------|
| ⚡ **极速生成** | 基于 NVIDIA 4090 GPU 集群，平均 10 秒出图 |
| 🧠 **多模型支持** | 支持 HiDream-I1、Flux.1-Dev、Stable Diffusion 3.5 等主流模型 |
| 🎨 **高质量输出** | 支持最高 3840×2160 分辨率，细节丰富 |
| 🔐 **无需登录** | 完全匿名使用，保护用户隐私 |
| 💬 **中英文提示词** | 支持中文输入（HiDream 模型优化），英文推荐以获得最佳效果 |
| 🖼️ **图生图功能** | 可上传参考图进行风格迁移与图像编辑 |
| 📦 **零配置部署** | 提供 Docker 镜像与 ComfyUI 集成方案 |
| 🆓 **100% 免费** | 无使用限制，生成图像可用于个人或商业用途 |

---

## 🖼️ 示例图库
![Demo 1](https://dreamify.slmnb.cn/_next/image?url=%2Fimages%2Fdemo-1.png&w=3840&q=75)
![Demo 2](https://dreamify.slmnb.cn/_next/image?url=%2Fimages%2Fdemo-2.png&w=3840&q=75)
![Demo 3](https://dreamify.slmnb.cn/_next/image?url=%2Fimages%2Fdemo-3.png&w=3840&q=75)
![Demo 4](https://dreamify.slmnb.cn/_next/image?url=%2Fimages%2Fdemo-11.png&w=3840&q=75)

> 所有图像均由 Dreamify 平台 AI 模型生成，用户拥有完整使用权。
---

## 🛠️ 技术架构

### 前端
- **框架**: [Next.js](https://nextjs.org) (App Router)
- **UI 库**: Tailwind CSS + Headless UI
- **状态管理**: React Context / Zustand（可选）
- **图像加载**: `next/image` 自动优化
- **国际化**: 内置 i18n 支持（中/英）

### 后端
- **AI 引擎**: [ComfyUI API](https://github.com/SaladTechnologies/comfyui-api)
- **模型支持**:
  - `HiDream-I1 Full Version`（北京智象未来科技）
  - `Flux.1-Dev`（Black Forest Lab 开源）
  - `Stable Diffusion 3.5`（Stability AI）
  - `Flux Kontext[Dev]`（12B 参数图像编辑模型）

### 部署方式
- 本地开发
- Docker 容器化
- Vercel / Netlify 静态托管（前端）
- 自建 ComfyUI 服务（后端）

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/slmnb-lab/Dreamify.git
cd Dreamify
```

### 2. 安装依赖

```bash
npm install
# 或使用 yarn
yarn install
```

### 3. 配置环境变量

创建 `.env` 文件：

```env
COMFYUI_API_URL=https://your-comfyui-api-endpoint.com
# 例如本地部署：
# COMFYUI_API_URL=http://localhost:8188
```

> 🔐 API 地址需支持 CORS 且开放 `/prompt`、`/queue` 等 ComfyUI 接口。

### 4. 启动开发服务器

```bash
npm run dev
```

访问：`http://localhost:3000`

---

## 🐋 Docker 部署：构建 ComfyUI + Flux 模型镜像

### 准备模型文件

```
comfyui/
├── Dockerfile
├── diffusion_models/
│   └── flux1-dev.safetensors
├── text_encoders/
│   ├── clip_l.safetensors
│   └── t5xxl_fp8_e4m3fn.safetensors
├── vae/
│   └── ae.safetensors
```

### Dockerfile

```dockerfile
# 使用 Salad 官方 ComfyUI API 基础镜像
FROM ghcr.io/saladtechnologies/comfyui-api:comfy0.3.27-api1.8.2-torchnightly-cuda12.8-runtime

# 设置环境
ENV DEBIAN_FRONTEND=noninteractive \
    COMFYUI_PORT=8188 \
    MODEL_DIR=/opt/ComfyUI/models

# 创建模型目录
RUN mkdir -p ${MODEL_DIR}/{loras,vaes,text_encoders,diffusion_models}

# 复制模型文件
COPY diffusion_models/*.safetensors ${MODEL_DIR}/diffusion_models/
COPY vae/*.safetensors ${MODEL_DIR}/vae/
COPY text_encoders/*.safetensors ${MODEL_DIR}/text_encoders/

# 暴露端口
EXPOSE ${COMFYUI_PORT}

# 启动服务
CMD ["python", "-m", "comfyui"]
```

### 构建并运行

```bash
docker build -t dreamify-comfyui:flux-dev .
docker run -d --gpus all -p 8188:8188 dreamify-comfyui:flux-dev
```

✅ 现在你的 ComfyUI 服务已在 `http://localhost:8188` 运行，并支持 Flux.1-Dev 模型！

---

## 📂 项目结构

```bash
Dreamify/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # 根布局
│   │   ├── page.tsx             # 主页
│   │   └── api/
│   │       └── generate/route.ts # Next.js API 路由，处理生图请求
│   ├── components/              # 可复用组件（Prompt 输入框、Gallery 等）
│   ├── lib/                     # 工具函数、API 客户端
│   └── messages/                # 国际化语言包（zh/en）
├── public/                      # 静态资源
├── .env                         # 环境变量
├── Dockerfile                   # 前端 Docker 镜像（可选）
├── next.config.js
├── package.json
└── README.md
```

---

## 🔄 API 调用流程

```text
Frontend (Next.js)
    ↓ POST /api/generate
    → 读取 .env 中的 COMFYUI_API_URL
    → 构造 ComfyUI 标准 Prompt JSON
    → 调用 ComfyUI /prompt 接口
    ← 返回生成图像 URL
    → 前端展示结果
```

> 支持 `prompt`, `negative_prompt`, `steps`, `width`, `height`, `model`, `image`（图生图）等参数。

---

## ❓ 常见问题（FAQ）

### Q: Dreamify 是完全免费的吗？  
A: 是的，Dreamify 提供完全免费的图像生成服务，无任何隐藏收费。

### Q: 生成的图像可以用于商业用途吗？  
A: 可以。用户拥有对生成图像的全部使用权，包括商业用途。

### Q: 是否需要注册账号？  
A: 不需要。Dreamify 支持匿名使用，无需登录。

### Q: 支持哪些 AI 模型？  
A: 当前支持：
- HiDream-I1（国产高性能模型）
- Flux.1-Dev（Black Forest Lab）
- Stable Diffusion 3.5
- Flux Kontext[Dev]（图像编辑）

### Q: 中文提示词支持吗？  
A: 支持！HiDream 模型对中文提示词有良好支持，其他模型建议使用英文以获得更佳效果。

---

## 🤝 贡献指南

我们欢迎任何形式的贡献！

- 🐞 **提交 Issue**：报告 Bug 或提出功能建议
- 🌟 **提交 PR**：修复问题、优化 UI、增加新功能
- 📚 **文档改进**：帮助完善 README 或多语言支持
- 🔗 **生态共建**：开发插件、Workflow、模型包

> 项目灵感来源于 [FluxEz](https://flux.comnergy.com/zh)，致敬开源社区！

---

## 📜 许可证

MIT License | © 2025 Dreamify Project

---

## 🌐 在线体验

👉 [立即体验 Dreamify](https://dreamify.slmnb.cn)

---

## 🧩 合作伙伴

我们与以下优秀 AI 工具平台合作，共同推动 AI 艺术生态发展：

- **[AnyComfy](https://anycomfy.com)**  
  一个免费、无限使用的在线 ComfyUI 平台，轻松运行任意 AI 绘画工作流。

---

💡 **让 AI 绘画变得简单，释放你的无限创意。**  
Built with ❤️ by [LastLight](https://github.com/LastLighter)