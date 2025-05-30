import { hidreamFp8Workflow, hidreamFp16Workflow, fluxDevWorkflow } from "./workflow";
const ModelMap = {
  "HiDream-full-fp8": hidreamFp8Workflow,
  "HiDream-full-fp16": hidreamFp16Workflow,
  "Flux-Dev": fluxDevWorkflow,
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
}

const urls = [
  process.env.HiDream_Fp8_IDC_API_URL || '',
  process.env.HiDream_Fp8_DOCKERWEB_API_URL || ''
];

export async function generateImage(params: GenerateParams): Promise<string> {
  // 1. 准备工作流数据
  const workflow = ModelMap[params.model as keyof typeof ModelMap];

  let baseUrl = '';
  if(params.model === 'HiDream-full-fp8') {
    // Randomly choose between IDC and DockerWeb URLs
    baseUrl = urls[Math.floor(Math.random() * urls.length)];
    setHiDreamWorkflowParams(workflow, params);
  } else if(params.model === 'HiDream-full-fp16') {
    baseUrl = process.env.HiDream_Fp16_IDC_API_URL || ''
    setHiDreamWorkflowParams(workflow, params);
  }else if(params.model === 'Flux-Dev') {
    baseUrl = process.env.Flux_Dev_DOCKERWEB_API_URL || ''
    setFluxDevWorkflowParams(workflow, params);
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

function setHiDreamWorkflowParams(workflow: any, params: GenerateParams) {
  // 更新工作流参数
  workflow["53"].inputs.width = params.width;
  workflow["53"].inputs.height = params.height;
  workflow["16"].inputs.text = params.prompt;
  workflow["3"].inputs.steps = params.steps;
  if (params.seed) {
    workflow["3"].inputs.seed = params.seed;
  }
}
function setFluxDevWorkflowParams(workflow: any, params: GenerateParams) {
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
