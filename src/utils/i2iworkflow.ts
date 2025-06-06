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
            "image": "73549163_p0.jpg"
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

