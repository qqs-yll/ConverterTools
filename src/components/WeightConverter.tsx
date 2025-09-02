import React, { useState, useEffect } from 'react';
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  Stack,
  IconButton,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import { SwapHoriz as SwapIcon, OfflineBolt as OfflineIcon } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { getAPI, isOfflineMode, enableOfflineMode, disableOfflineMode, getAPITimeout, getWorkingAPI } from '../config';
import { convertWeight } from '../utils/offlineConverter';
import ConverterLayout from '../components/ConverterLayout';

const WeightConverter: React.FC = () => {
  const { t } = useLanguage();
  const [value, setValue] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<string>('kg');
  const [toUnit, setToUnit] = useState<string>('lb');
  const [result, setResult] = useState<string>('');
  const [rate, setRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [offline, setOffline] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'error' | 'info' | 'success' | 'warning'}>({
    open: false,
    message: '',
    severity: 'error'
  });

  // 初始化时检查全局离线状态，但允许后续的在线转换
  useEffect(() => {
    // 只在第一次加载时检查，不持续监听
    if (isOfflineMode()) {
      console.log('初始化时检测到全局离线模式');
      setOffline(true);
    }
  }, []);

  const weightUnits = [
    { value: 'mg', label: t('weightUnits.mg') },
    { value: 'g', label: t('weightUnits.g') },
    { value: 'kg', label: t('weightUnits.kg') },
    { value: 't', label: t('weightUnits.t') },
    { value: 'oz', label: t('weightUnits.oz') },
    { value: 'lb', label: t('weightUnits.lb') },
    { value: 'st', label: t('weightUnits.st') },
    { value: 'cwt', label: t('weightUnits.cwt') },
    { value: 'gr', label: t('weightUnits.gr') },
    { value: 'ct', label: t('weightUnits.ct') },
  ];

  // 离线转换函数
  const handleOfflineConvert = (numValue: number) => {
    console.log('使用离线模式进行重量转换');
    const conversionResult = convertWeight(numValue, fromUnit, toUnit);
    
    if (conversionResult.success) {
      setResult(conversionResult.result || '');
      setRate(conversionResult.rate || null);
      setLastUpdated(new Date().toLocaleTimeString());
      setOffline(true);
    } else {
      setSnackbar({ 
        open: true, 
        message: conversionResult.error || '离线转换失败', 
        severity: 'error' 
      });
      setResult('');
      setRate(null);
    }
  };

  // 在线API转换函数
  const handleOnlineConvert = async (numValue: number) => {
    let apiToUse = getAPI();
    
    // 首先尝试获取工作的API
    try {
      console.log('正在查找可用的API...');
      apiToUse = await getWorkingAPI();
      console.log('使用API:', apiToUse);
    } catch (error) {
      console.log('API查找失败，使用离线模式');
      handleOfflineConvert(numValue);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log('API请求超时，切换到离线模式');
      enableOfflineMode();
      handleOfflineConvert(numValue);
    }, getAPITimeout());

    try {
      const requestData = {
        amount: numValue,
        from: fromUnit,
        to: toUnit,
      };
      
      console.log('发送请求到:', `${apiToUse}/api/convert/weight`);
      
      const response = await fetch(`${apiToUse}/api/convert/weight`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('响应状态:', response.status);
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('无效的内容类型:', contentType);
        throw new Error('服务器响应格式错误');
      }
      
      const data = await response.json();
      console.log('响应数据:', data);
      
      if (!response.ok) {
        console.error('API返回错误:', data);
        throw new Error(data.error || '转换失败');
      }
      
      const resultNum = typeof data.result === 'string' ? parseFloat(data.result) : data.result;
      console.log('转换结果:', resultNum);
      
      setResult(resultNum.toFixed(6));
      setRate(data.rate);
      setLastUpdated(new Date().toLocaleTimeString());
      setOffline(false);
      
      // 成功时重置全局离线模式
      disableOfflineMode();
      
      console.log('在线转换成功完成');
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.log('请求被取消，已切换到离线模式');
        return; // handleOfflineConvert 已经在超时处理中调用
      }
      
      console.error('Weight Converter 错误:', error);
      
      // 网络错误时自动切换到离线模式
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.log('网络错误，切换到离线模式');
        enableOfflineMode();
        handleOfflineConvert(numValue);
        return;
      }
      
      // 其他错误显示错误信息，但也尝试离线模式
      console.log('API失败，尝试离线模式');
      handleOfflineConvert(numValue);
    }
  };

  const handleConvert = async () => {
    if (!value) {
      setSnackbar({ open: true, message: t('common.pleaseEnterValue'), severity: 'error' });
      setResult('');
      setRate(null);
      return;
    }
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setSnackbar({ open: true, message: t('common.pleaseEnterValidNumber'), severity: 'error' });
      setResult('');
      setRate(null);
      return;
    }
    
    setLoading(true);
    
    try {
      if (isOfflineMode()) {
        console.log('当前处于离线模式');
        handleOfflineConvert(numValue);
      } else {
        console.log('尝试在线转换');
        await handleOnlineConvert(numValue);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setResult('');
    setValue('');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ConverterLayout
      title={t('converters.weight.title')}
      description={t('converters.weight.description')}
      icon="⚖️"
    >
      <Stack spacing={3} width="100%">
        {/* 离线模式指示器 */}
        {offline && (
          <Box display="flex" justifyContent="center">
            <Chip 
              icon={<OfflineIcon />}
              label={t('common.offlineMode')}
              color="warning"
              variant="outlined"
              size="small"
            />
          </Box>
        )}

        <TextField
          fullWidth
          label={t('common.enterValue')}
          variant="outlined"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="number"
          InputProps={{ inputProps: { step: 'any' } }}
        />
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            fullWidth
            select
            label={t('common.from')}
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            variant="outlined"
            SelectProps={{
              MenuProps: {
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              },
            }}
          >
            {weightUnits.map((unit) => (
              <MenuItem key={unit.value} value={unit.value}>
                {unit.label}
              </MenuItem>
            ))}
          </TextField>
          
          <IconButton
            onClick={handleSwap}
            sx={{ bgcolor: 'background.default', '&:hover': { bgcolor: 'action.hover' } }}
          >
            <SwapIcon />
          </IconButton>
          
          <TextField
            fullWidth
            select
            label={t('common.to')}
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            variant="outlined"
            SelectProps={{
              MenuProps: {
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              },
            }}
          >
            {weightUnits.map((unit) => (
              <MenuItem key={unit.value} value={unit.value}>
                {unit.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleConvert}
          size="large"
          sx={{ py: 1.5, fontSize: '1.1rem', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}
          disabled={loading}
        >
          {loading ? t('common.converting') : t('common.convert')}
        </Button>
        
        {result && !loading && (
          <Box
            sx={{ mt: 2, p: 3, borderRadius: 2, bgcolor: 'background.paper', textAlign: 'center', boxShadow: 1 }}
          >
            <Typography variant="h5" component="div" gutterBottom>
              {t('common.result')}:
            </Typography>
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}
            >
              {result} {toUnit}
            </Typography>
            {rate && (
              <Typography variant="body2" color="text.secondary">
                {t('common.conversionRate')}: 1 {fromUnit} = {rate.toFixed(6)} {toUnit}
                <br />
                {t('common.lastUpdated')}: {lastUpdated}
                {offline && <><br />📱 离线计算结果</>}
              </Typography>
            )}
          </Box>
        )}
      </Stack>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ConverterLayout>
  );
};

export default WeightConverter; 