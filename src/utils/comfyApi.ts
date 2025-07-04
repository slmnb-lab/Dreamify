import { hidreamFp8T2IWorkflow,  fluxDevT2IWorkflow, stableDiffusion3T2IWorkflow } from "./t2iworkflow";
import { fluxI2IWorkflow, fluxKontextI2IWorkflow } from "./i2iworkflow";
const T2IModelMap = {
  "HiDream-full-fp8": hidreamFp8T2IWorkflow,
  "Flux-Dev": fluxDevT2IWorkflow,
  "Stable-Diffusion-3.5": stableDiffusion3T2IWorkflow
}

const I2IModelMap = {
  "Flux-Dev": fluxI2IWorkflow,
  "Flux-Kontext": fluxKontextI2IWorkflow
}

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
  model: string;
  image?: string;
  denoise?: number;
}

const urls = [
  process.env.HiDream_Fp8_IDC_API_URL || '',
  process.env.HiDream_Fp8_DOCKERWEB_API_URL || ''
];

export async function generateImage(params: GenerateParams): Promise<string> {
  // 1. 准备工作流数据
  let workflow = {};
  if(params.image){
    workflow = I2IModelMap[params.model as keyof typeof I2IModelMap];
  }else{
    workflow = T2IModelMap[params.model as keyof typeof T2IModelMap];
  }

  let baseUrl = '';
  if(params.model === 'HiDream-full-fp8') {
    // Randomly choose between IDC and DockerWeb URLs
    baseUrl = urls[Math.floor(Math.random() * urls.length)];
    setHiDreamWT2IorkflowParams(workflow, params);
  }else if(params.model === 'Flux-Dev') {
    baseUrl = process.env.Flux_Dev_DOCKERWEB_API_URL || ''
    if(params.image){
      setFluxDevI2IorkflowParams(workflow, params);
    }else{
      setFluxDevWT2IorkflowParams(workflow, params);
    }
  }else if(params.model === 'Flux-Kontext') {
    baseUrl = process.env.Kontext_fp8_URL || ''
    if(params.image){
      setFluxKontxtI2IorkflowParams(workflow, params);
    }
  }else if(params.model === 'Stable-Diffusion-3.5') {
    baseUrl = process.env.Stable_Diffusion_3_5_URL || ''
    setStableDiffusion3T2IorkflowParams(workflow, params);
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

function setHiDreamWT2IorkflowParams(workflow: any, params: GenerateParams) {
  // 更新工作流参数
  workflow["53"].inputs.width = params.width;
  workflow["53"].inputs.height = params.height;
  workflow["16"].inputs.text = params.prompt;
  workflow["3"].inputs.steps = params.steps;
  if (params.seed) {
    workflow["3"].inputs.seed = params.seed;
  }
}
function setFluxDevWT2IorkflowParams(workflow: any, params: GenerateParams) {
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
}

function setFluxDevI2IorkflowParams(workflow: any, params: GenerateParams) {
  workflow["50"].inputs.image = params.image;
  workflow["52"].inputs.width = params.width;
  workflow["52"].inputs.height = params.height;
  workflow["46"].inputs.width = params.width;
  workflow["46"].inputs.height = params.height;
  if (params.denoise) {
    workflow["17"].inputs.denoise = params.denoise;
  }
  if (params.seed) {
    workflow["45"].inputs.noise_seed = params.seed;
  }
  workflow["43"].inputs.text = params.prompt;
}

// function setHiDreamI2IorkflowParams(workflow: any, params: GenerateParams) {
//   // 更新工作流参数
//   workflow["74"].inputs.image = params.image;
//   workflow["76"].inputs.width = params.width;
//   workflow["76"].inputs.height = params.height;
//   workflow["16"].inputs.text = params.prompt;
//   workflow["3"].inputs.steps = params.steps;
//   if (params.seed) {
//     workflow["3"].inputs.seed = params.seed;
//   }
//   if (params.denoise) {
//     workflow["3"].inputs.denoise = params.denoise;
//   }
// }

function setFluxKontxtI2IorkflowParams(workflow: any, params: GenerateParams) {
  workflow["142"].inputs.image = params.image;
  workflow["6"].inputs.text = params.prompt;
  workflow["31"].inputs.steps = params.steps;
  if (params.seed) {
    workflow["31"].inputs.seed = params.seed;
  }
  //denoise = 1
}

function setStableDiffusion3T2IorkflowParams(workflow: any, params: GenerateParams) {
  workflow["53"].inputs.width = params.width;
  workflow["53"].inputs.height = params.height;
  workflow["16"].inputs.text = params.prompt;
  workflow["3"].inputs.steps = params.steps;
  if (params.seed) {
    workflow["3"].inputs.seed = params.seed;
  }
}
