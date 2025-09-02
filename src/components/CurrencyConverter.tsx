import React, { useState } from 'react';
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  Stack,
  IconButton,
} from '@mui/material';
import { SwapHoriz as SwapIcon } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { getAPI } from '../config';
import ConverterLayout from '../components/ConverterLayout';

const CurrencyConverter: React.FC = () => {
  const { t } = useLanguage();
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [result, setResult] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const handleConvert = async () => {
    if (!amount) {
      setResult(t('common.pleaseEnterAmount'));
      return;
    }

    console.log('=== 货币转换开始 ===');
    console.log('环境信息:', {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      onLine: navigator.onLine,
      cookieEnabled: navigator.cookieEnabled,
      language: navigator.language,
      href: window.location.href,
      protocol: window.location.protocol
    });
    
    const apiUrl = `/api/convert/currency`;
    console.log('API URL:', apiUrl);
    
    const requestData = {
      value: amount,
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
    };
    console.log('请求数据:', requestData);

    try {
      console.log('开始发送fetch请求...');
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      console.log('响应收到:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('内容类型错误:', contentType);
        const responseText = await response.text();
        console.error('响应文本:', responseText);
        throw new Error(`${t('common.serverError')} (Content-Type: ${contentType})`);
      }
      
      const data = await response.json();
      console.log('解析的响应数据:', data);
      
      if (!response.ok) {
        console.error('API错误响应:', data);
        throw new Error(data.error || t('common.conversionFailed'));
      }
      
      const resultNum = typeof data.result === 'string' ? parseFloat(data.result) : data.result;
      console.log('最终结果:', resultNum);
      
      setResult(resultNum.toFixed(2));
      setExchangeRate(data.rate.toFixed(4));
      setLastUpdated(new Date().toLocaleString());
      
      console.log('=== 货币转换成功 ===');
    } catch (error: any) {
      console.error('=== 货币转换失败 ===');
      console.error('错误对象:', error);
      console.error('错误详情:', {
        name: error?.name,
        message: error?.message,
        stack: error?.stack
      });
      
      let errorMessage = t('common.conversionFailedPleaseTryAgain');
      
      if (error?.name === 'TypeError') {
        if (error?.message?.includes('fetch')) {
          errorMessage = '网络连接失败，请检查网络连接';
        } else if (error?.message?.includes('JSON')) {
          errorMessage = '服务器响应格式错误';
        }
      } else if (error?.name === 'NetworkError') {
        errorMessage = '网络错误，请检查网络连接';
      }
      
      console.log('显示错误消息:', errorMessage);
      setResult(errorMessage);
      setExchangeRate('');
      setLastUpdated('');
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult('');
    setExchangeRate('');
  };

  const currencies = [
    { value: 'USD', label: t('currencies.USD') },
    { value: 'EUR', label: t('currencies.EUR') },
    { value: 'GBP', label: t('currencies.GBP') },
    { value: 'JPY', label: t('currencies.JPY') },
    { value: 'CNY', label: t('currencies.CNY') },
    { value: 'AUD', label: t('currencies.AUD') },
    { value: 'CAD', label: t('currencies.CAD') },
    { value: 'CHF', label: t('currencies.CHF') },
    { value: 'HKD', label: t('currencies.HKD') },
    { value: 'SGD', label: t('currencies.SGD') },
    { value: 'KRW', label: t('currencies.KRW') },
    { value: 'THB', label: t('currencies.THB') },
    { value: 'MYR', label: t('currencies.MYR') },
    { value: 'IDR', label: t('currencies.IDR') },
    { value: 'PHP', label: t('currencies.PHP') },
    { value: 'VND', label: t('currencies.VND') },
    { value: 'BRL', label: t('currencies.BRL') },
    { value: 'MXN', label: t('currencies.MXN') },
    { value: 'ARS', label: t('currencies.ARS') },
    { value: 'CLP', label: t('currencies.CLP') },
    { value: 'PEN', label: t('currencies.PEN') },
    { value: 'COP', label: t('currencies.COP') },
    { value: 'UYU', label: t('currencies.UYU') },
    { value: 'PYG', label: t('currencies.PYG') },
    { value: 'BOB', label: t('currencies.BOB') },
    { value: 'NOK', label: t('currencies.NOK') },
    { value: 'SEK', label: t('currencies.SEK') },
    { value: 'DKK', label: t('currencies.DKK') },
    { value: 'PLN', label: t('currencies.PLN') },
    { value: 'CZK', label: t('currencies.CZK') },
    { value: 'HUF', label: t('currencies.HUF') },
    { value: 'RON', label: t('currencies.RON') },
    { value: 'BGN', label: t('currencies.BGN') },
    { value: 'HRK', label: t('currencies.HRK') },
    { value: 'RSD', label: t('currencies.RSD') },
    { value: 'TRY', label: t('currencies.TRY') },
    { value: 'ILS', label: t('currencies.ILS') },
    { value: 'EGP', label: t('currencies.EGP') },
    { value: 'ZAR', label: t('currencies.ZAR') },
    { value: 'NGN', label: t('currencies.NGN') },
    { value: 'KES', label: t('currencies.KES') },
    { value: 'GHS', label: t('currencies.GHS') },
    { value: 'UGX', label: t('currencies.UGX') },
    { value: 'TZS', label: t('currencies.TZS') },
    { value: 'MAD', label: t('currencies.MAD') },
    { value: 'TND', label: t('currencies.TND') },
    { value: 'DZD', label: t('currencies.DZD') },
    { value: 'LYD', label: t('currencies.LYD') }
  ];

  return (
    <ConverterLayout
      title={t('converters.currency.title')}
      description={t('converters.currency.description')}
      icon="💱"
    >
      <Stack spacing={3} width="100%">
        <TextField
          fullWidth
          label={t('common.enterAmount')}
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          InputProps={{
            inputProps: { 
              min: 0,
              step: 'any'
            }
          }}
        />
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            fullWidth
            select
            label={t('common.from')}
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
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
            {currencies.map((currency) => (
              <MenuItem key={currency.value} value={currency.value}>
                {currency.label}
              </MenuItem>
            ))}
          </TextField>
          
          <IconButton 
            onClick={handleSwap}
            sx={{
              bgcolor: 'background.default',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <SwapIcon />
          </IconButton>
          
          <TextField
            fullWidth
            select
            label={t('common.to')}
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
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
            {currencies.map((currency) => (
              <MenuItem key={currency.value} value={currency.value}>
                {currency.label}
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
          sx={{
            py: 1.5,
            fontSize: '1.1rem',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}
        >
          {t('common.convert')}
        </Button>

        {result && (
          <Box
            sx={{
              mt: 2,
              p: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              textAlign: 'center',
              boxShadow: 1
            }}
          >
            <Typography variant="h5" component="div" gutterBottom>
              {t('common.result')}:
            </Typography>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 2
              }}
            >
              {result} {toCurrency}
            </Typography>
            {exchangeRate && (
              <Typography variant="body2" color="text.secondary">
                {t('common.exchangeRate')}: 1 {fromCurrency} = {exchangeRate} {toCurrency}
                <br />
                {t('common.lastUpdated')}: {lastUpdated}
              </Typography>
            )}
          </Box>
        )}
      </Stack>
    </ConverterLayout>
  );
};

export default CurrencyConverter; 