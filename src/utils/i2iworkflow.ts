export const fluxI2IWorkflow = {
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
            "denoise": 0.6000000000000001,
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
                "53",
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
            "text": "Realistic style, a girl",
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
    "45": {
        "inputs": {
            "noise_seed": 539066632465820
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
    },
    "50": {
        "inputs": {
            "image": "73549163_p0.jpg",
            "upload": "image"
        },
        "class_type": "LoadImage",
        "_meta": {
            "title": "加载图像"
        }
    },
    "52": {
        "inputs": {
            "upscale_method": "area",
            "width": 512,
            "height": 512,
            "crop": "disabled",
            "image": [
                "50",
                0
            ]
        },
        "class_type": "ImageScale",
        "_meta": {
            "title": "缩放图像"
        }
    },
    "53": {
        "inputs": {
            "pixels": [
                "52",
                0
            ],
            "vae": [
                "10",
                0
            ]
        },
        "class_type": "VAEEncode",
        "_meta": {
            "title": "VAE编码"
        }
    }
}

const hidreamFp8I2IWorkflow =
{
    "3": {
        "inputs": {
            "seed": 930077853577925,
            "steps": 30,
            "cfg": 5,
            "sampler_name": "ddim",
            "scheduler": "ddim_uniform",
            "denoise": 0.4000000000000001,
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
                "75",
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
            "text": "nude",
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
    },
    "74": {
        "inputs": {
            "image": "73549163_p0.jpg"
        },
        "class_type": "LoadImage",
        "_meta": {
            "title": "加载图像"
        }
    },
    "75": {
        "inputs": {
            "pixels": [
                "76",
                0
            ],
            "vae": [
                "55",
                0
            ]
        },
        "class_type": "VAEEncode",
        "_meta": {
            "title": "VAE编码"
        }
    },
    "76": {
        "inputs": {
            "upscale_method": "area",
            "width": 512,
            "height": 512,
            "crop": "disabled",
            "image": [
                "74",
                0
            ]
        },
        "class_type": "ImageScale",
        "_meta": {
            "title": "缩放图像"
        }
    }
}

export const fluxKontextI2IWorkflow = {
    "6": {
      "inputs": {
        "text": "convert the image to realistic style",
        "clip": [
          "38",
          0
        ]
      },
      "class_type": "CLIPTextEncode",
      "_meta": {
        "title": "CLIP Text Encode (Positive Prompt)"
      }
    },
    "8": {
      "inputs": {
        "samples": [
          "31",
          0
        ],
        "vae": [
          "39",
          0
        ]
      },
      "class_type": "VAEDecode",
      "_meta": {
        "title": "VAE解码"
      }
    },
    "31": {
      "inputs": {
        "seed": 631182276828015,
        "steps": 20,
        "cfg": 1,
        "sampler_name": "euler",
        "scheduler": "simple",
        "denoise": 1,
        "model": [
          "37",
          0
        ],
        "positive": [
          "35",
          0
        ],
        "negative": [
          "135",
          0
        ],
        "latent_image": [
          "124",
          0
        ]
      },
      "class_type": "KSampler",
      "_meta": {
        "title": "K采样器"
      }
    },
    "35": {
      "inputs": {
        "guidance": 2.5,
        "conditioning": [
          "177",
          0
        ]
      },
      "class_type": "FluxGuidance",
      "_meta": {
        "title": "Flux引导"
      }
    },
    "37": {
      "inputs": {
        "unet_name": "flux1-dev-kontext_fp8_scaled.safetensors",
        "weight_dtype": "default"
      },
      "class_type": "UNETLoader",
      "_meta": {
        "title": "UNet加载器"
      }
    },
    "38": {
      "inputs": {
        "clip_name1": "clip_l.safetensors",
        "clip_name2": "t5xxl_fp8_e4m3fn_scaled.safetensors",
        "type": "flux",
        "device": "default"
      },
      "class_type": "DualCLIPLoader",
      "_meta": {
        "title": "双CLIP加载器"
      }
    },
    "39": {
      "inputs": {
        "vae_name": "ae.safetensors"
      },
      "class_type": "VAELoader",
      "_meta": {
        "title": "加载VAE"
      }
    },
    "124": {
      "inputs": {
        "pixels": [
          "189",
          0
        ],
        "vae": [
          "39",
          0
        ]
      },
      "class_type": "VAEEncode",
      "_meta": {
        "title": "VAE编码"
      }
    },
    "135": {
      "inputs": {
        "conditioning": [
          "6",
          0
        ]
      },
      "class_type": "ConditioningZeroOut",
      "_meta": {
        "title": "条件零化"
      }
    },
    "136": {
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
    "142": {
      "inputs": {
        "image": "1_WH_1200x900px.jpg",
        "upload": "image"
      },
      "class_type": "LoadImage",
      "_meta": {
        "title": "加载图像）"
      }
    },
    "173": {
      "inputs": {
        "images": [
          "189",
          0
        ]
      },
      "class_type": "PreviewImage",
      "_meta": {
        "title": "预览图像"
      }
    },
    "177": {
      "inputs": {
        "conditioning": [
          "6",
          0
        ],
        "latent": [
          "124",
          0
        ]
      },
      "class_type": "ReferenceLatent",
      "_meta": {
        "title": "ReferenceLatent"
      }
    },
    "189": {
      "inputs": {
        "target_width": 512,
        "target_height": 512,
        "padding_color": "white",
        "interpolation": "bilinear",
        "image": [
          "142",
          0
        ]
      },
      "class_type": "ResizeAndPadImage",
      "_meta": {
        "title": "ResizeAndPadImage"
      }
    }
  }

export { hidreamFp8I2IWorkflow };

const hidreamFp16I2IWorkflow = JSON.parse(JSON.stringify(hidreamFp8I2IWorkflow));
hidreamFp16I2IWorkflow["69"].inputs.unet_name = "hidream_i1_full_fp16.safetensors";
export { hidreamFp16I2IWorkflow };