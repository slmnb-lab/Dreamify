const hidreamWorkflowTemplate = {
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

const fluxWorkflowTemplate = {
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
      "text": "best quality,a cute anime girl,sunshine,soft features,swing,a blue white edged dress,solo,flower,blue eyes,blush,blue flower,long hair,barefoot,sitting,looking at viewer,blue rose,blue theme,rose,light particles,pale skin,blue background,off shoulder,full body,smile,collarbone,long hair,blue hair,vines,plants,",
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
      "noise_seed": 1114957019097397
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
}

const stableDiffusion3WorkflowTemplate = {
  "3": {
    "inputs": {
      "seed": 996048915053053,
      "steps": 30,
      "cfg": 5.45,
      "sampler_name": "euler",
      "scheduler": "sgm_uniform",
      "denoise": 1,
      "model": [
        "4",
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
  "4": {
    "inputs": {
      "ckpt_name": "sd3.5_large.safetensors"
    },
    "class_type": "CheckpointLoaderSimple",
    "_meta": {
      "title": "Checkpoint加载器（简易）"
    }
  },
  "8": {
    "inputs": {
      "samples": [
        "3",
        0
      ],
      "vae": [
        "4",
        2
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
      "text": "A dark-mode-friendly logo with glowing neon blue outlines forming a cloud and binary code particles, evoking 'always online' reliability.",
      "clip": [
        "43",
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
      "text": "Vibrant tones, overexposed, static, details unclear, subtitles, style, work, painting, image, still, overall greyish, worst quality, low quality, JPEG compression artifacts, ugly, flawed, excessive fingers, poorly drawn hands, poorly drawn faces, deformed, disfigured, misshapen limbs, fingers merging, motionless image, cluttered background, three legs, many people in the background, walking backwards",
      "clip": [
        "43",
        0
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "Negative Prompt"
    }
  },
  "41": {
    "inputs": {
      "clip_name": "t5xxl_fp8_e4m3fn.safetensors",
      "type": "sd3",
      "device": "default"
    },
    "class_type": "CLIPLoader",
    "_meta": {
      "title": "加载CLIP"
    }
  },
  "42": {
    "inputs": {
      "clip_name1": "clip_l.safetensors",
      "clip_name2": "clip_g.safetensors",
      "type": "sd3",
      "device": "default"
    },
    "class_type": "DualCLIPLoader",
    "_meta": {
      "title": "双CLIP加载器"
    }
  },
  "43": {
    "inputs": {
      "clip_name1": "clip_l.safetensors",
      "clip_name2": "clip_g.safetensors",
      "clip_name3": "t5xxl_fp8_e4m3fn.safetensors"
    },
    "class_type": "TripleCLIPLoader",
    "_meta": {
      "title": "三重CLIP加载器"
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
  }
}

const model1 = JSON.parse(JSON.stringify(hidreamWorkflowTemplate));
model1["69"].inputs.unet_name = "hidream_i1_full_fp8.safetensors";
export const hidreamFp8T2IWorkflow = model1 as object;

const model2 = JSON.parse(JSON.stringify(hidreamWorkflowTemplate));
model2["69"].inputs.unet_name = "hidream_i1_full_fp16.safetensors";
export const hidreamFp16T2IWorkflow = model2 as object;

const model3 = JSON.parse(JSON.stringify(fluxWorkflowTemplate))
export const fluxDevT2IWorkflow = model3 as object;

export const stableDiffusion3T2IWorkflow = stableDiffusion3WorkflowTemplate