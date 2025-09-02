// API配置
const config = {
  // 主要API地址列表（按优先级排序）
  apiEndpoints: [
    // 本地开发环境优先
    ...(typeof window !== 'undefined' && window.location.hostname === 'localhost' 
      ? ['http://localhost:3000'] 
      : []
    ),
    // 第一优先：您的自定义域名API（移动端兼容性最好）
    'https://api.tecgw.com',
    
    // 第二备用：新的Vercel后端
    'https://converter-tools-backend.vercel.app',
    
    // 第三备用：原Vercel后端
    'https://converter-tools-qaz354073.vercel.app'
  ],
  
  // 离线模式配置
  offlineMode: false,
  apiTimeout: 3000, // 3秒超时（恢复正常）
  maxRetries: 1,    // 减少重试次数，快速切换到下一个API或离线模式
  forceOfflineOnMobile: false, // 移动端不强制离线模式
  
  // 环境配置
  isDevelopment: typeof window !== 'undefined' && window.location.hostname === 'localhost',
  isProduction: typeof window !== 'undefined' && window.location.hostname !== 'localhost'
};

// 当前使用的API索引
let currentAPIIndex = 0;
let lastWorkingAPI: string | null = null;

// 检测是否为移动设备
const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// 测试API连接的函数
export const testAPIConnection = async (apiUrl: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeout = isMobile() ? config.apiTimeout * 0.8 : config.apiTimeout; // 移动端更短超时
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    console.log(`测试API连接: ${apiUrl} (${isMobile() ? '移动端' : '桌面端'})`);
    
    const response = await fetch(`${apiUrl}/api/convert/weight`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache' // 移动端避免缓存问题
      },
      body: JSON.stringify({ amount: 1, from: 'kg', to: 'g' }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const isWorking = response.ok;
    console.log(`API ${apiUrl} 测试结果:`, isWorking ? '✅ 成功' : `❌ 失败 (${response.status})`);
    return isWorking;
  } catch (error) {
    const errorMsg = (error as Error).message;
    console.log(`API ${apiUrl} 测试失败:`, errorMsg);
    
    // 移动端特殊错误处理
    if (isMobile() && (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError'))) {
      console.log('移动端网络问题，建议启用离线模式');
    }
    
    return false;
  }
};

// 获取可用的API地址
export const getWorkingAPI = async (): Promise<string> => {
  // 检查是否应该强制使用离线模式
  if (config.forceOfflineOnMobile && isMobile()) {
    console.log('移动端强制启用离线模式');
    config.offlineMode = true;
    return config.apiEndpoints[0]; // 返回第一个API作为占位符
  }
  
  // 如果之前有工作的API，优先使用
  if (lastWorkingAPI && await testAPIConnection(lastWorkingAPI)) {
    console.log(`使用上次工作的API: ${lastWorkingAPI}`);
    return lastWorkingAPI;
  }
  
  // 从当前索引开始测试所有API（移动端只测试一轮）
  const maxTests = isMobile() ? 1 : config.apiEndpoints.length;
  
  for (let i = 0; i < maxTests; i++) {
    const apiIndex = (currentAPIIndex + i) % config.apiEndpoints.length;
    const api = config.apiEndpoints[apiIndex];
    
    if (await testAPIConnection(api)) {
      currentAPIIndex = apiIndex;
      lastWorkingAPI = api;
      console.log(`找到可用的API: ${api}`);
      return api;
    }
  }
  
  // 如果都失败，启用离线模式
  config.offlineMode = true;
  console.warn('所有API都不可用，已启用离线模式');
  
  // 返回第一个API（用于错误处理）
  return config.apiEndpoints[0];
};

// 获取API基础URL
export const getAPIBaseUrl = (): string => {
  return lastWorkingAPI || config.apiEndpoints[currentAPIIndex];
};

// 获取完整的API URL
export const getAPIUrl = (endpoint: string): string => {
  const baseUrl = getAPIBaseUrl();
  if (baseUrl) {
    return `${baseUrl}${endpoint}`;
  }
  return endpoint;
};

// 检查是否在离线模式
export const isOfflineMode = (): boolean => {
  return config.offlineMode;
};

// 强制启用离线模式
export const enableOfflineMode = (): void => {
  config.offlineMode = true;
  console.log('已手动启用离线模式');
};

// 禁用离线模式并重置API选择
export const disableOfflineMode = (): void => {
  config.offlineMode = false;
  currentAPIIndex = 0;
  lastWorkingAPI = null;
  console.log('已禁用离线模式，重置API选择');
};

// 统一的API获取函数
export const getAPI = (): string => {
  return lastWorkingAPI || config.apiEndpoints[currentAPIIndex];
};

// 向后兼容的函数名
export const getFileConversionAPI = (): string => {
  return getAPI();
};

// 获取API超时时间
export const getAPITimeout = (): number => {
  return config.apiTimeout;
};

// 获取所有API端点（用于调试）
export const getAllAPIs = (): string[] => {
  return [...config.apiEndpoints];
};

export default config; 