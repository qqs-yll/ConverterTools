import React, { useState, useEffect } from 'react';
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  Stack,
  IconButton,
  Alert,
  Chip,
} from '@mui/material';
import { SwapHoriz as SwapIcon, WifiOff as WifiOffIcon } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import ConverterLayout from '../components/ConverterLayout';
import { convertTimezone } from '../utils/offlineConverter';

const TimeZoneConverter: React.FC = () => {
  const { t } = useLanguage();
  const [dateTime, setDateTime] = useState<string>('');
  const [fromTimezone, setFromTimezone] = useState<string>('UTC');
  const [toTimezone, setToTimezone] = useState<string>('Asia/Shanghai');
  const [result, setResult] = useState<{ original: string; converted: string } | null>(null);
  const [error, setError] = useState<string>('');
  const handleConvert = async () => {
    if (!dateTime) {
      setError(t('common.pleaseSelectDateTime'));
      return;
    }

    // 如果源时区和目标时区相同，提醒用户选择不同时区
    if (fromTimezone === toTimezone) {
      setError(t('common.pleaseSelectDifferentTimeZones'));
      setResult(null);
      return;
    }

    try {
      const conversionResult = convertTimezone(dateTime, fromTimezone, toTimezone);
      if (conversionResult.success && conversionResult.result) {
        const parsed = JSON.parse(conversionResult.result);
        setResult({
          original: parsed.original,
          converted: parsed.converted
        });
        setError('');
      } else {
        setError(conversionResult.error || t('common.conversionFailedPleaseTryAgain'));
        setResult(null);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : t('common.conversionFailedPleaseTryAgain'));
      setResult(null);
    }
  };

  const handleSwap = () => {
    setFromTimezone(toTimezone);
    setToTimezone(fromTimezone);
    setResult(null);
    setError('');
  };

  const timeZones = [
    { value: 'UTC', label: t('timeZones.UTC') },
    { value: 'Asia/Shanghai', label: t('timeZones.Asia/Shanghai') },
    { value: 'Asia/Tokyo', label: t('timeZones.Asia/Tokyo') },
    { value: 'America/New_York', label: t('timeZones.America/New_York') },
    { value: 'America/Los_Angeles', label: t('timeZones.America/Los_Angeles') },
    { value: 'Europe/London', label: t('timeZones.Europe/London') },
    { value: 'Europe/Paris', label: t('timeZones.Europe/Paris') },
    { value: 'Australia/Sydney', label: t('timeZones.Australia/Sydney') },
    { value: 'Asia/Kolkata', label: t('timeZones.Asia/Kolkata') },
    { value: 'Europe/Moscow', label: t('timeZones.Europe/Moscow') },
    { value: 'Africa/Cairo', label: t('timeZones.Africa/Cairo') },
    { value: 'America/Sao_Paulo', label: t('timeZones.America/Sao_Paulo') },
    { value: 'Pacific/Auckland', label: t('timeZones.Pacific/Auckland') },
    { value: 'Asia/Singapore', label: t('timeZones.Asia/Singapore') },
    { value: 'Asia/Hong_Kong', label: t('timeZones.Asia/Hong_Kong') },
  ];

  return (
    <ConverterLayout
      title={t('converters.timezone.title')}
      description={t('converters.timezone.description')}
      icon="🌍"
    >
      <Stack spacing={3} width="100%">
        <TextField
          fullWidth
          label={t('common.selectDateTime')}
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          variant="outlined"
          placeholder={t('common.dateTimePlaceholder')}
          helperText={t('common.dateTimeHelperText')}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            placeholder: t('common.dateTimePlaceholder')
          }}
        />
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            fullWidth
            select
            label={t('common.fromTimeZone')}
            value={fromTimezone}
            onChange={(e) => setFromTimezone(e.target.value)}
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
            {timeZones.map((zone) => (
              <MenuItem key={zone.value} value={zone.value}>
                {zone.label}
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
            label={t('common.toTimeZone')}
            value={toTimezone}
            onChange={(e) => setToTimezone(e.target.value)}
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
            {timeZones.map((zone) => (
              <MenuItem key={zone.value} value={zone.value}>
                {zone.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        
        <Stack direction="row" spacing={1} alignItems="center">
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
            {t('common.convert').toUpperCase()}
          </Button>
        </Stack>

        {error && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: '#FFF3F3',
              color: '#D32F2F',
              textAlign: 'center',
            }}
          >
            <Typography variant="body1">
              {error}
            </Typography>
          </Box>
        )}

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
            <Typography variant="h6" component="div" gutterBottom>
              {t('common.originalTime')} ({fromTimezone}):
            </Typography>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 2
              }}
            >
              {result.original}
            </Typography>
            
            <Typography variant="h6" component="div" gutterBottom>
              {t('common.convertedTime')} ({toTimezone}):
            </Typography>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: 'secondary.main',
              }}
            >
              {result.converted}
            </Typography>
          </Box>
        )}
      </Stack>
    </ConverterLayout>
  );
};

export default TimeZoneConverter; 