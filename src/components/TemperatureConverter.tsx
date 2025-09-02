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
import ConverterLayout from '../components/ConverterLayout';
import { convertTemperature } from '../utils/offlineConverter';

const TemperatureConverter: React.FC = () => {
  const { t } = useLanguage();
  const [value, setValue] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<string>('C');
  const [toUnit, setToUnit] = useState<string>('F');
  const [result, setResult] = useState<string>('');

  const handleConvert = () => {
    if (!value) {
      setResult(t('common.pleaseEnterValue'));
      return;
    }

    try {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        setResult(t('common.pleaseEnterValidNumber'));
        return;
      }
      
      const conversionResult = convertTemperature(numValue, fromUnit, toUnit);
      if (conversionResult.success) {
        setResult(conversionResult.result || '');
      } else {
        throw new Error(conversionResult.error || t('common.conversionFailed'));
      }
    } catch (error) {
      setResult(t('common.conversionFailedPleaseTryAgain'));
    }
  };

  const temperatureUnits = [
    { value: 'C', label: t('temperatureUnits.c') },
    { value: 'F', label: t('temperatureUnits.f') },
    { value: 'K', label: t('temperatureUnits.k') },
  ];

  return (
    <ConverterLayout
      title={t('converters.temperature.title')}
      description={t('converters.temperature.description')}
      icon="🌡️"
    >
      <Stack spacing={3} width="100%">
        <TextField
          fullWidth
          label={t('common.enterValue')}
          variant="outlined"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="number"
          InputProps={{
            inputProps: { step: 'any' }
          }}
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
            {temperatureUnits.map((unit) => (
              <MenuItem key={unit.value} value={unit.value}>
                {unit.label}
              </MenuItem>
            ))}
          </TextField>
          
          <IconButton
            onClick={() => {
              const temp = fromUnit;
              setFromUnit(toUnit);
              setToUnit(temp);
              setResult('');
            }}
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
            {temperatureUnits.map((unit) => (
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
                color: 'primary.main'
              }}
            >
              {result} {toUnit === 'C' ? '°C' : toUnit === 'F' ? '°F' : 'K'}
            </Typography>
          </Box>
        )}
      </Stack>
    </ConverterLayout>
  );
};

export default TemperatureConverter; 