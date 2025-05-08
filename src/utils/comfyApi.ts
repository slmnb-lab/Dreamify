interface ComfyUIResponse {
  images: string[];
}

interface GenerateParams {
  prompt: string;
  width: number;
  height: number;
  steps: number;
  seed?: number;
  batch_size: number;
}

const workflowTemplate = 
  {
    "8": {
      "inputs": {
        "samples": [
          "40",
          0
        ],
        "vae": [
          "10",
          0
        ]
      },
      "class_type": "VAEDecode",
      "_meta": {
        "title": "VAE解码"
      }
    },
    "10": {
      "inputs": {
        "vae_name": "ae.safetensors"
      },
      "class_type": "VAELoader",
      "_meta": {
        "title": "加载VAE"
      }
    },
    "11": {
      "inputs": {
        "clip_name1": "t5xxl_fp8_e4m3fn.safetensors",
        "clip_name2": "clip_l.safetensors",
        "type": "flux",
        "device": "default"
      },
      "class_type": "DualCLIPLoader",
      "_meta": {
        "title": "双CLIP加载器"
      }
    },
    "17": {
      "inputs": {
        "scheduler": "normal",
        "steps": 25,
        "denoise": 1,
        "model": [
          "46",
          0
        ]
      },
      "class_type": "BasicScheduler",
      "_meta": {
        "title": "基本调度器"
      }
    },
    "38": {
      "inputs": {
        "model": [
          "46",
          0
        ],
        "conditioning": [
          "42",
          0
        ]
      },
      "class_type": "BasicGuider",
      "_meta": {
        "title": "基本引导器"
      }
    },
    "39": {
      "inputs": {
        "filename_prefix": "FluxEz",
        "images": [
          "8",
          0
        ]
      },
      "class_type": "SaveImage",
      "_meta": {
        "title": "保存图像"
      }
    },
    "40": {
      "inputs": {
        "noise": [
          "45",
          0
        ],
        "guider": [
          "38",
          0
        ],
        "sampler": [
          "47",
          0
        ],
        "sigmas": [
          "17",
          0
        ],
        "latent_image": [
          "44",
          0
        ]
      },
      "class_type": "SamplerCustomAdvanced",
      "_meta": {
        "title": "自定义采样器（高级）"
      }
    },
    "42": {
      "inputs": {
        "guidance": 3.5,
        "conditioning": [
          "43",
          0
        ]
      },
      "class_type": "FluxGuidance",
      "_meta": {
        "title": "Flux引导"
      }
    },
    "43": {
      "inputs": {
        "text": "beautiful photography of a gonger haired artist with Lots of Colorful coloursplashes in face and pn her hands, she is natural, having her hair in a casual bun, looking happily into camera, cinematic,",
        "clip": [
          "11",
          0
        ]
      },
      "class_type": "CLIPTextEncode",
      "_meta": {
        "title": "CLIP文本编码"
      }
    },
    "44": {
      "inputs": {
        "width": 1024,
        "height": 1024,
        "batch_size": 1
      },
      "class_type": "EmptySD3LatentImage",
      "_meta": {
        "title": "空Latent图像（SD3）"
      }
    },
    "45": {
      "inputs": {
        "noise_seed": 454905699352480
      },
      "class_type": "RandomNoise",
      "_meta": {
        "title": "随机噪波"
      }
    },
    "46": {
      "inputs": {
        "max_shift": 1.15,
        "base_shift": 0.5,
        "width": 1024,
        "height": 1024,
        "model": [
          "48",
          0
        ]
      },
      "class_type": "ModelSamplingFlux",
      "_meta": {
        "title": "采样算法（Flux）"
      }
    },
    "47": {
      "inputs": {
        "sampler_name": "euler"
      },
      "class_type": "KSamplerSelect",
      "_meta": {
        "title": "K采样器选择"
      }
    },
    "48": {
      "inputs": {
        "unet_name": "flux1-dev.safetensors",
        "weight_dtype": "default"
      },
      "class_type": "UNETLoader",
      "_meta": {
        "title": "UNet加载器"
      }
    }
  };

export async function generateImage(params: GenerateParams, baseUrl: string): Promise<string> {
  // 1. 准备工作流数据
  const workflow = JSON.parse(JSON.stringify(workflowTemplate));

  // 更新工作流参数
  workflow["44"].inputs.width = params.width;
  workflow["44"].inputs.height = params.height;
  workflow["46"].inputs.width = params.width;
  workflow["46"].inputs.height = params.height;
  // workflow["5"].inputs.batch_size = params.batch_size;
  workflow["43"].inputs.text = params.prompt;
  workflow["17"].inputs.steps = params.steps;
  if (params.seed) {
    workflow["45"].inputs.noise_seed = params.seed;
  }

  try {
    // 2. 发送提示请求并等待响应
      const response = await fetch(`${baseUrl}/prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: workflow }),
      });

      let base64Image: string = '';
      let text = ''
      try {
        text = await response.text();
        const data = JSON.parse(text) as ComfyUIResponse;
        base64Image = "data:image/png;base64," + data.images[0];
      } catch {
        throw new Error(`Invalid JSON response: ${text}`);
      }


      return base64Image;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
} 