// API配置
const config = {
  // 主要API地址
  apiEndpoints: [
    // 本地开发环境优先
    ...(typeof window !== 'undefined' && window.location.hostname === 'localhost' 
      ? ['http://localhost:3000'] 
      : []
    ),
    // 生产环境使用用户自定义域名
    'https://www.convertertoolsqqs.online'
  ],
  
  // 离线模式配置
  offlineMode: false,
  apiTimeout: 3000, // 3秒超时
  maxRetries: 1,    // 减少重试次数
  
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
  // 直接使用生产环境API，不进行复杂测试
  const api = config.apiEndpoints.find(ep => 
    ep.includes('convertertoolsqqs.online') || 
    (config.isDevelopment && ep.includes('localhost'))
  );
  
  return api || config.apiEndpoints[0];
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
  return config.apiEndpoints.find(ep => 
    ep.includes('convertertoolsqqs.online') || 
    (config.isDevelopment && ep.includes('localhost'))
  ) || config.apiEndpoints[0];
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