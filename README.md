# FluxEz - Free AI Image Generation Tool

![FluxEz Interface](./public/images/Flux-demo.png)

A Next.js-based website for Flux.1-dev model image generation, powered by [ComfyUI API](https://github.com/SaladTechnologies/comfyui-api) backend.

## ✨ Key Features

- ⚡ **10s Generation** - 4090 GPU accelerated
- 🎨 **Flux.1-dev Model** - Superior image quality
- 🛠️ **Customizable** - Multiple generation parameters
- 🆓 **100% Free** - No limits or hidden costs
- 🔌 **Zero Configuration** - No login required

## 🚀 Quick Start

1. Visit [FluxEz Live Demo](https://flux.comnergy.com/zh)
2. Enter your prompt (English recommended)
3. Click "Generate" and wait ~10s

## 🖼️ Gallery

![](./public/images/demo-1.jpg)
![](./public/images/demo-2.jpg)

## 🛠️ Development

### Project Structure
fluxez/  
├── src/  
│ ├── app/ # Next.js core  
│ │ └── generate/  
│ │ └── route.ts # API endpoint handler  
├── public/ # Static assets  
└── package.json # Dependencies  


### Local Setup

```bash
git clone https://github.com/your-repo/fluxez.git
cd fluxez
npm install
npm run dev
Access http://localhost:3000 after starting

Backend Configuration
The ComfyUI API endpoint is in .env file:

// set env varible
COMFYUI_API_URL = "https://your-comfyui-api-url" 
```

## 🐋 Docker Image Building (Flux Model for ComfyUI)

To package the Flux model as a ComfyUI Docker image:

### Prerequisites
- Docker installed

### Build Process

1. **Prepare the directory structure**:
   ```bash
   comfyUI/
   └── Dockerfile
   ├── diffusion_models/
   │   └── flux1-schnell.safetensors
   ├── text_encoders/
   │   ├── clip_l.safetensors
   │   └── t5xxl_fp8_e4m3fn.safetensors
   ├── vae/
   │   └── ae.safetensors
Use this Dockerfile:
```dockerfile
dockerfile
# Use NVIDIA CUDA base image
FROM ghcr.io/saladtechnologies/comfyui-api:comfy0.3.27-api1.8.2-torchnightly-cuda12.8-runtime

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive \
    COMFYUI_PORT=8188 \
    MODEL_DIR=/opt/ComfyUI/models \
    BASE=""

# Create model directory structure
RUN mkdir -p ${MODEL_DIR}/{loras,vaes,text_encoders,diffusion_models}

# Copy model files
COPY diffusion_models/*.safetensors ${MODEL_DIR}/diffusion_models/
COPY vae/*.safetensors ${MODEL_DIR}/vae/
COPY text_encoders/*.safetensors ${MODEL_DIR}/text_encoders/

# Expose port
EXPOSE ${COMFYUI_PORT}
```
Build the image:
```bash
docker build -t flux-comfyui:latest .
```
Run the container:

```bash
docker run -d --gpus all -p 8188:8188 flux-comfyui:latest
```
Note: The base image is from comfyui-api
## 🤝 Contributing
We welcome:

Feature requests (via Issues)

Code contributions (via PRs)

📜 License
MIT Licensed | © 2023 FluxEz Project

Live Demo ➡️ [FluxEz Website](https://flux.comnergy.com/zh)