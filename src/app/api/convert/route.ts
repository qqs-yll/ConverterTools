import { NextRequest, NextResponse } from 'next/server';

// 单位转换率
const conversionRates = {
  weight: {
    'kg': 1,
    'g': 1000,
    'mg': 1000000,
    't': 0.001,
    'lb': 2.20462,
    'oz': 35.274,
    'st': 0.157473,
    'cwt': 0.0196841,
    'gr': 15432.4,
    'ct': 5000
  },
  length: {
    'm': 1,
    'cm': 100,
    'mm': 1000,
    'km': 0.001,
    'ft': 3.28084,
    'in': 39.3701,
    'yd': 1.09361,
    'mi': 0.000621371,
    'nm': 0.000539957,
    'ly': 1.057e-16
  },
  volume: {
    'l': 1,
    'ml': 1000,
    'gal': 0.264172,
    'm3': 0.001,
    'ft3': 0.0353147,
    'cm3': 1000,
    'mm3': 1000000,
    'in3': 61.0237,
    'yd3': 0.00130795,
    'qt': 1.05669,
    'pt': 2.11338,
    'cup': 4.22675,
    'oz': 33.814,
    'tbsp': 67.628,
    'tsp': 202.884
  }
};

// 固定汇率（作为备用，当实时API失败时使用）
const fixedRates = {
  'USD': 1,
  'EUR': 0.92,
  'GBP': 0.78,
  'JPY': 158,
  'CNY': 7.15,
  'AUD': 1.51,
  'CAD': 1.37,
  'CHF': 0.89,
  'HKD': 7.82,
  'SGD': 1.35,
  'KRW': 1350,
  'THB': 36.5,
  'MYR': 4.75,
  'IDR': 15800,
  'PHP': 58.5,
  'VND': 24800,
  'BRL': 5.45,
  'MXN': 18.2,
  'ARS': 890,
  'CLP': 950,
  'PEN': 3.75,
  'COP': 3900,
  'UYU': 39.5,
  'PYG': 7300,
  'BOB': 6.95,
  'NOK': 10.8,
  'SEK': 10.5,
  'DKK': 6.95,
  'PLN': 4.05,
  'CZK': 23.5,
  'HUF': 365,
  'RON': 4.65,
  'BGN': 1.82,
  'HRK': 6.95,
  'RSD': 108,
  'TRY': 32.5,
  'ILS': 3.75,
  'EGP': 31.2,
  'ZAR': 18.5,
  'NGN': 1580,
  'KES': 158,
  'GHS': 15.8,
  'UGX': 3800,
  'TZS': 2580,
  'MAD': 9.85,
  'TND': 3.15,
  'DZD': 135,
  'LYD': 4.85
};

// 获取实时汇率的函数
async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  // 如果源货币和目标货币相同，直接返回1
  if (fromCurrency === toCurrency) {
    return 1;
  }

  // 本地开发环境优先使用固定汇率，避免CORS问题
  const isLocalhost = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
  
  if (isLocalhost) {
    console.log('本地开发环境，使用固定汇率');
    const fromRate = fixedRates[fromCurrency as keyof typeof fixedRates];
    const toRate = fixedRates[toCurrency as keyof typeof fixedRates];
    
    if (!fromRate || !toRate) {
      console.error(`不支持的货币: ${fromCurrency} 或 ${toCurrency}`);
      throw new Error(`Unsupported currency: ${fromCurrency} or ${toCurrency}`);
    }
    
    const calculatedRate = toRate / fromRate;
    console.log(`本地固定汇率: ${fromCurrency} -> ${toCurrency} = ${calculatedRate}`);
    return calculatedRate;
  }

  // 生产环境尝试获取实时汇率 - 使用与旧版本相同的API
  try {
    console.log('尝试获取实时汇率...');
    
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ConverterTools/1.0'
      },
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      throw new Error(`API响应状态: ${response.status}`);
    }
    
    const data = await response.json();
    const rate = data.rates?.[toCurrency];
    
    if (rate && typeof rate === 'number' && rate > 0) {
      console.log(`成功获取实时汇率: ${fromCurrency} -> ${toCurrency} = ${rate}`);
      return rate;
    } else {
      throw new Error('API返回的汇率无效');
    }
    
  } catch (error) {
    console.warn('获取实时汇率失败，使用固定汇率:', error);
  }

  // 如果实时API失败，使用固定汇率
  console.warn('使用固定汇率作为备用方案');
  
  const fromRate = fixedRates[fromCurrency as keyof typeof fixedRates];
  const toRate = fixedRates[toCurrency as keyof typeof fixedRates];
  
  if (!fromRate || !toRate) {
    console.error(`不支持的货币: ${fromCurrency} 或 ${toCurrency}`);
    throw new Error(`Unsupported currency: ${fromCurrency} or ${toCurrency}`);
  }
  
  const calculatedRate = toRate / fromRate;
  console.log(`使用固定汇率计算: ${fromCurrency} -> ${toCurrency} = ${calculatedRate}`);
  
  return calculatedRate;
}

// 货币转换函数
async function convertCurrency(value: number, fromCurrency: string, toCurrency: string) {
  if (fromCurrency === toCurrency) {
    return { 
      success: true,
      result: value.toFixed(2), 
      rate: 1 
    };
  }
  
  const rate = await getExchangeRate(fromCurrency, toCurrency);
  const result = value * rate;
  
  return { 
    success: true,
    result: result.toFixed(2), 
    rate: rate 
  };
}

// 通用单位转换函数
function convertUnit(value: number, fromUnit: string, toUnit: string, rates: Record<string, number>) {
  if (fromUnit === toUnit) {
    return { 
      success: true,
      result: value.toFixed(6), 
      rate: 1 
    };
  }
  
  const fromRate = rates[fromUnit];
  const toRate = rates[toUnit];
  
  if (!fromRate || !toRate) {
    throw new Error(`Unsupported unit: ${fromUnit} or ${toUnit}`);
  }
  
  const baseValue = value / fromRate;
  const result = baseValue * toRate;
  const rate = toRate / fromRate;
  
  return { 
    success: true,
    result: result.toFixed(6), 
    rate: parseFloat(rate.toFixed(6))
  };
}

// 温度转换函数
function convertTemperature(value: number, fromUnit: string, toUnit: string) {
  if (fromUnit === toUnit) {
    return { 
      success: true,
      result: value.toFixed(2), 
      rate: 1 
    };
  }
  
  let celsius: number;
  
  // 先转换为摄氏度
  switch (fromUnit.toLowerCase()) {
    case 'c':
      celsius = value;
      break;
    case 'f':
      celsius = (value - 32) * 5/9;
      break;
    case 'k':
      celsius = value - 273.15;
      break;
    case 'r':
      celsius = (value - 491.67) * 5/9;
      break;
    default:
      throw new Error(`Unsupported temperature unit: ${fromUnit}`);
  }
  
  // 从摄氏度转换为目标单位
  let result: number;
  switch (toUnit.toLowerCase()) {
    case 'c':
      result = celsius;
      break;
    case 'f':
      result = celsius * 9/5 + 32;
      break;
    case 'k':
      result = celsius + 273.15;
      break;
    case 'r':
      result = (celsius + 273.15) * 9/5;
      break;
    default:
      throw new Error(`Unsupported temperature unit: ${toUnit}`);
  }
  
  return { 
    success: true,
    result: result.toFixed(2)
  };
}

// 时区转换函数
function convertTimezone(dateTime: string, fromTimezone: string, toTimezone: string) {
  try {
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }
    
    // 创建源时区的日期对象
    const sourceDate = new Date(date.toLocaleString('en-US', { timeZone: fromTimezone }));
    
    // 创建目标时区的日期对象
    const targetDate = new Date(date.toLocaleString('en-US', { timeZone: toTimezone }));
    
    // 计算时差（毫秒）
    const timeDiff = targetDate.getTime() - sourceDate.getTime();
    
    // 应用时差
    const resultDate = new Date(date.getTime() + timeDiff);
    
    return {
      success: true,
      original: resultDate.toISOString(),
      converted: resultDate.toISOString(),
      fromTimezone,
      toTimezone
    };
  } catch (error) {
    throw new Error(`Timezone conversion failed: ${error}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = request.url;
    const pathname = new URL(url).pathname;
    
    // 检测是否为本地开发环境
    const isLocalhost = process.env.NODE_ENV === 'development';
    
    console.log('API Request:', { url, pathname, body, environment: isLocalhost ? 'local' : 'production' });
    
    // 货币转换 - 修复URL匹配逻辑
    if (pathname.includes('/api/convert/currency') || body.type === 'currency') {
      console.log('处理货币转换请求');
      const { value, fromCurrency, toCurrency, amount, from, to } = body;
      const finalValue = value || amount;
      const finalFrom = fromCurrency || from;
      const finalTo = toCurrency || to;
      
      console.log('货币转换参数:', { finalValue, finalFrom, finalTo });
      
      if (!finalValue || !finalFrom || !finalTo) {
        console.log('货币转换参数缺失');
        return NextResponse.json({ 
          success: false, 
          error: 'Missing required parameters: value/amount, fromCurrency/from, toCurrency/to' 
        }, { status: 400 });
      }
      
      try {
        const result = await convertCurrency(parseFloat(finalValue), finalFrom, finalTo);
        console.log('货币转换结果:', result);
        
        // 本地环境添加快速响应标记
        if (isLocalhost) {
          console.log('本地货币转换完成，响应时间: 立即');
        }
        
        return NextResponse.json(result);
      } catch (error) {
        console.error('货币转换函数错误:', error);
        return NextResponse.json({ 
          success: false, 
          error: (error as Error).message || 'Currency conversion failed' 
        }, { status: 400 });
      }
    }
    
    // 重量转换 - 本地优先
    if (pathname.includes('/api/convert/weight') || body.type === 'weight') {
      const { value, fromUnit, toUnit, amount, from, to } = body;
      const finalValue = value || amount;
      const finalFrom = fromUnit || from;
      const finalTo = toUnit || to;
      
      if (!finalValue || !finalFrom || !finalTo) {
        return NextResponse.json({ 
          success: false, 
          error: 'Missing required parameters: value/amount, fromUnit/from, toUnit/to' 
        }, { status: 400 });
      }
      
      const result = convertUnit(finalValue, finalFrom, finalTo, conversionRates.weight);
      
      if (isLocalhost) {
        console.log('本地重量转换完成，响应时间: 立即');
      }
      
      return NextResponse.json(result);
    }
    
    // 长度转换 - 本地优先
    if (pathname.includes('/api/convert/length') || body.type === 'length') {
      const { value, fromUnit, toUnit, amount, from, to } = body;
      const finalValue = value || amount;
      const finalFrom = fromUnit || from;
      const finalTo = toUnit || to;
      
      if (!finalValue || !finalFrom || !finalTo) {
        return NextResponse.json({ 
          success: false, 
          error: 'Missing required parameters: value/amount, fromUnit/from, toUnit/to' 
        }, { status: 400 });
      }
      
      const result = convertUnit(finalValue, finalFrom, finalTo, conversionRates.length);
      
      if (isLocalhost) {
        console.log('本地长度转换完成，响应时间: 立即');
      }
      
      return NextResponse.json(result);
    }
    
    // 体积转换 - 本地优先
    if (pathname.includes('/api/convert/volume') || body.type === 'volume') {
      const { value, fromUnit, toUnit, amount, from, to } = body;
      const finalValue = value || amount;
      const finalFrom = fromUnit || from;
      const finalTo = toUnit || to;
      
      if (!finalValue || !finalFrom || !finalTo) {
        return NextResponse.json({ 
          success: false, 
          error: 'Missing required parameters: value/amount, fromUnit/from, toUnit/to' 
        }, { status: 400 });
      }
      
      const result = convertUnit(finalValue, finalFrom, finalTo, conversionRates.volume);
      
      if (isLocalhost) {
        console.log('本地体积转换完成，响应时间: 立即');
      }
      
      return NextResponse.json(result);
    }
    
    // 温度转换 - 本地优先
    if (pathname.includes('/api/convert/temperature') || body.type === 'temperature') {
      const { value, fromUnit, toUnit, amount, from, to } = body;
      const finalValue = value || amount;
      const finalFrom = fromUnit || from;
      const finalTo = toUnit || to;
      
      if (!finalValue || !finalFrom || !finalTo) {
        return NextResponse.json({ 
          success: false, 
          error: 'Missing required parameters: value/amount, fromUnit/from, toUnit/to' 
        }, { status: 400 });
      }
      
      const result = convertTemperature(finalValue, finalFrom, finalTo);
      
      if (isLocalhost) {
        console.log('本地温度转换完成，响应时间: 立即');
      }
      
      return NextResponse.json(result);
    }
    
    // 时区转换
    if (pathname.includes('/api/convert/timezone') || body.type === 'timezone') {
      const { dateTime, fromTimezone, toTimezone } = body;
      const result = convertTimezone(dateTime, fromTimezone, toTimezone);
      return NextResponse.json(result);
    }
    
    console.log('未找到匹配的API端点，URL:', url);
    return NextResponse.json({ error: 'API endpoint not found' }, { status: 404 });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message || 'Internal server error' 
    }, { status: 400 });
  }
}
