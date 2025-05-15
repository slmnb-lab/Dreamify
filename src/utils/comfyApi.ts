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
  "3": {
    "inputs": {
      "seed": 1008338326435302,
      "steps": 50,
      "cfg": 5,
      "sampler_name": "uni_pc",
      "scheduler": "simple",
      "denoise": 1,
      "model": [
        "70",
        0
      ],
      "positive": [
        "16",
        0
      ],
      "negative": [
        "40",
        0
      ],
      "latent_image": [
        "53",
        0
      ]
    },
    "class_type": "KSampler",
    "_meta": {
      "title": "K采样器"
    }
  },
  "8": {
    "inputs": {
      "samples": [
        "3",
        0
      ],
      "vae": [
        "55",
        0
      ]
    },
    "class_type": "VAEDecode",
    "_meta": {
      "title": "VAE解码"
    }
  },
  "9": {
    "inputs": {
      "filename_prefix": "ComfyUI",
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
  "16": {
    "inputs": {
      "text": "The dusk thickens, lanterns flicker on.\nShadows flow over flagstones, past taverns heavy with aroma and fluttering silk fans.\nThen—a flute’s clear note splits the air, startling doves from the eaves.\nSomewhere, an opera singer’s tremolo melts into the night, steeped in tea and applause.",
      "clip": [
        "54",
        0
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "Positive Prompt"
    }
  },
  "40": {
    "inputs": {
      "text": "blurry",
      "clip": [
        "54",
        0
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "Negative Prompt"
    }
  },
  "53": {
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
  "54": {
    "inputs": {
      "clip_name1": "clip_l_hidream.safetensors",
      "clip_name2": "clip_g_hidream.safetensors",
      "clip_name3": "t5xxl_fp8_e4m3fn.safetensors",
      "clip_name4": "llama_3.1_8b_instruct_fp8_scaled.safetensors"
    },
    "class_type": "QuadrupleCLIPLoader",
    "_meta": {
      "title": "QuadrupleCLIPLoader"
    }
  },
  "55": {
    "inputs": {
      "vae_name": "ae.safetensors"
    },
    "class_type": "VAELoader",
    "_meta": {
      "title": "加载VAE"
    }
  },
  "69": {
    "inputs": {
      "unet_name": "hidream_i1_full_fp8.safetensors",
      "weight_dtype": "default"
    },
    "class_type": "UNETLoader",
    "_meta": {
      "title": "UNet加载器"
    }
  },
  "70": {
    "inputs": {
      "shift": 3.0000000000000004,
      "model": [
        "69",
        0
      ]
    },
    "class_type": "ModelSamplingSD3",
    "_meta": {
      "title": "采样算法（SD3）"
    }
  }
}

export async function generateImage(params: GenerateParams, baseUrl: string): Promise<string> {
  // 1. 准备工作流数据
  const workflow = JSON.parse(JSON.stringify(workflowTemplate));

  // 更新工作流参数
  workflow["53"].inputs.width = params.width;
  workflow["53"].inputs.height = params.height;
  workflow["16"].inputs.text = params.prompt;
  workflow["3"].inputs.steps = params.steps;
  if (params.seed) {
    workflow["3"].inputs.seed = params.seed;
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

    console.log("response.type", response.type);
    return base64Image;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}