// 纯前端转换工具 - 不依赖API的备用方案

export interface ConversionResult {
  success: boolean;
  result?: string;
  rate?: number;
  error?: string;
}

// 重量转换率（以千克为基准）
const weightRates: Record<string, number> = {
  'mg': 1000000,      // 毫克
  'g': 1000,          // 克
  'kg': 1,            // 千克（基准）
  't': 0.001,         // 吨
  'oz': 35.274,       // 盎司
  'lb': 2.20462,      // 磅
  'st': 0.157473,     // 英石
  'cwt': 0.0196841,   // 英担
  'gr': 15432.4,      // 格令
  'ct': 5000          // 克拉
};

// 长度转换率（以米为基准）
const lengthRates: Record<string, number> = {
  'mm': 1000,         // 毫米
  'cm': 100,          // 厘米
  'm': 1,             // 米（基准）
  'km': 0.001,        // 千米
  'in': 39.3701,      // 英寸
  'ft': 3.28084,      // 英尺
  'yd': 1.09361,      // 码
  'mi': 0.000621371,  // 英里
  'nm': 0.000539957,  // 海里
  'ly': 1.057e-16     // 光年
};

// 体积转换率（以升为基准）
const volumeRates: Record<string, number> = {
  'ml': 1000,         // 毫升
  'l': 1,             // 升（基准）
  'gal': 0.264172,    // 加仑
  'm3': 0.001,        // 立方米
  'ft3': 0.0353147,   // 立方英尺
  'cm3': 1000,        // 立方厘米
  'mm3': 1000000,     // 立方毫米
  'in3': 61.0237,     // 立方英寸
  'yd3': 0.00130795,  // 立方码
  'qt': 1.05669,      // 夸脱
  'pt': 2.11338,      // 品脱
  'cup': 4.22675,     // 杯
  'oz': 33.814,       // 液体盎司
  'tbsp': 67.628,     // 汤匙
  'tsp': 202.884      // 茶匙
};

// 重量转换
export function convertWeight(amount: number, from: string, to: string): ConversionResult {
  try {
    if (!weightRates[from] || !weightRates[to]) {
      return {
        success: false,
        error: `不支持的重量单位: ${from} 或 ${to}`
      };
    }

    // 转换为基准单位（千克），然后转换为目标单位
    const baseAmount = amount / weightRates[from];
    const result = baseAmount * weightRates[to];
    const rate = weightRates[to] / weightRates[from];

    return {
      success: true,
      result: result.toFixed(6),
      rate: parseFloat(rate.toFixed(6))
    };
  } catch (error) {
    return {
      success: false,
      error: `重量转换失败: ${(error as Error).message}`
    };
  }
}

// 长度转换
export function convertLength(amount: number, from: string, to: string): ConversionResult {
  try {
    if (!lengthRates[from] || !lengthRates[to]) {
      return {
        success: false,
        error: `不支持的长度单位: ${from} 或 ${to}`
      };
    }

    const baseAmount = amount / lengthRates[from];
    const result = baseAmount * lengthRates[to];
    const rate = lengthRates[to] / lengthRates[from];

    return {
      success: true,
      result: result.toFixed(6),
      rate: parseFloat(rate.toFixed(6))
    };
  } catch (error) {
    return {
      success: false,
      error: `长度转换失败: ${(error as Error).message}`
    };
  }
}

// 体积转换
export function convertVolume(amount: number, from: string, to: string): ConversionResult {
  try {
    if (!volumeRates[from] || !volumeRates[to]) {
      return {
        success: false,
        error: `不支持的体积单位: ${from} 或 ${to}`
      };
    }

    const baseAmount = amount / volumeRates[from];
    const result = baseAmount * volumeRates[to];
    const rate = volumeRates[to] / volumeRates[from];

    return {
      success: true,
      result: result.toFixed(6),
      rate: parseFloat(rate.toFixed(6))
    };
  } catch (error) {
    return {
      success: false,
      error: `体积转换失败: ${(error as Error).message}`
    };
  }
}

// 温度转换
export function convertTemperature(amount: number, from: string, to: string): ConversionResult {
  try {
    let celsius: number;
    
    // 转换为摄氏度
    switch (from.toLowerCase()) {
      case 'c': celsius = amount; break;
      case 'f': celsius = (amount - 32) * 5/9; break;
      case 'k': celsius = amount - 273.15; break;
      case 'r': celsius = (amount - 491.67) * 5/9; break;
      default: 
        return {
          success: false,
          error: `不支持的温度单位: ${from}`
        };
    }
    
    // 从摄氏度转换为目标单位
    let result: number;
    switch (to.toLowerCase()) {
      case 'c': result = celsius; break;
      case 'f': result = celsius * 9/5 + 32; break;
      case 'k': result = celsius + 273.15; break;
      case 'r': result = celsius * 9/5 + 491.67; break;
      default:
        return {
          success: false,
          error: `不支持的温度单位: ${to}`
        };
    }

    return {
      success: true,
      result: result.toFixed(2)
    };
  } catch (error) {
    return {
      success: false,
      error: `温度转换失败: ${(error as Error).message}`
    };
  }
}

// 时区转换
export function convertTimezone(dateTime: string, fromTimezone: string, toTimezone: string): ConversionResult {
  try {
    // 解析输入的日期时间，确保格式正确
    let inputDateString = dateTime;
    
    // 如果是datetime-local格式(YYYY-MM-DDTHH:mm)，添加秒数
    if (typeof dateTime === 'string' && dateTime.includes('T') && dateTime.split(':').length === 2) {
      inputDateString = dateTime + ':00';
    }
    
    // 解析输入时间（作为本地时间）
    const inputDate = new Date(inputDateString);
    
    if (isNaN(inputDate.getTime())) {
      return {
        success: false,
        error: '无效的日期时间格式'
      };
    }

    // 获取输入时间的组成部分
    const year = inputDate.getFullYear();
    const month = inputDate.getMonth();
    const date = inputDate.getDate();
    const hours = inputDate.getHours();
    const minutes = inputDate.getMinutes();
    const seconds = inputDate.getSeconds();
    
    try {
      // 关键：把这个时间当作源时区的本地时间
      // 方法：创建两个同样的时间，一个在UTC，一个在源时区，计算差值
      const baseTime = new Date(2000, 0, 1, 12, 0, 0); // 基准时间
      const utcBase = baseTime.getTime();
      const sourceBase = new Date(baseTime.toLocaleString('en-US', { timeZone: fromTimezone })).getTime();
      const offset = utcBase - sourceBase; // 源时区相对UTC的偏移
      
      // 创建源时区的真实UTC时间戳
      const sourceUTC = new Date(year, month, date, hours, minutes, seconds).getTime() + offset;
      
      // 基于这个UTC时间戳，在两个时区显示时间
      const sourceDate = new Date(sourceUTC);
      
      const formatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      } as const;
      
      // 在源时区显示的时间（应该等于用户输入）
      const originalTime = sourceDate.toLocaleString('zh-CN', {
        ...formatOptions,
        timeZone: fromTimezone
      });
      
      // 在目标时区显示的时间（转换结果）
      const convertedTime = sourceDate.toLocaleString('zh-CN', {
        ...formatOptions,
        timeZone: toTimezone
      });

      return {
        success: true,
        result: JSON.stringify({
          original: originalTime,
          converted: convertedTime
        })
      };
    } catch (timezoneError) {
      return {
        success: false,
        error: `不支持的时区或时区转换失败: ${(timezoneError as Error).message}`
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `时区转换失败: ${(error as Error).message}`
    };
  }
}

// 货币转换（使用固定汇率作为示例，实际项目中需要实时汇率）
const fixedRates: Record<string, number> = {
  'USD': 1,       // 美元作为基准
  'EUR': 0.85,    // 欧元
  'GBP': 0.73,    // 英镑
  'JPY': 110,     // 日元
  'CNY': 6.45,    // 人民币
  'AUD': 1.35,    // 澳元
  'CAD': 1.25,    // 加元
  'CHF': 0.92,    // 瑞士法郎
  'HKD': 7.8,     // 港币
  'SGD': 1.35     // 新币
};

export function convertCurrency(amount: number, from: string, to: string): ConversionResult {
  try {
    if (!fixedRates[from] || !fixedRates[to]) {
      return {
        success: false,
        error: `不支持的货币: ${from} 或 ${to}`
      };
    }

    // 转换为美元，然后转换为目标货币
    const usdAmount = amount / fixedRates[from];
    const result = usdAmount * fixedRates[to];
    const rate = fixedRates[to] / fixedRates[from];

    return {
      success: true,
      result: result.toFixed(2),
      rate: parseFloat(rate.toFixed(4))
    };
  } catch (error) {
    return {
      success: false,
      error: `货币转换失败: ${(error as Error).message}`
    };
  }
} 