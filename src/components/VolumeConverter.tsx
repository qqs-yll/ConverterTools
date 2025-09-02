import React, { useState } from 'react';
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  Stack,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { SwapHoriz as SwapIcon } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import ConverterLayout from '../components/ConverterLayout';
import { getAPI } from '../config';

const getVolumeUnits = (t: (key: string) => string) => [
  { value: 'mm3', label: t('units.volume.cubicMillimeter') },
  { value: 'cm3', label: t('units.volume.cubicCentimeter') },
  { value: 'ml', label: t('units.volume.milliliter') },
  { value: 'l', label: t('units.volume.liter') },
  { value: 'm3', label: t('units.volume.cubicMeter') },
  { value: 'in3', label: t('units.volume.cubicInch') },
  { value: 'ft3', label: t('units.volume.cubicFoot') },
  { value: 'yd3', label: t('units.volume.cubicYard') },
  { value: 'gal', label: t('units.volume.gallon') },
  { value: 'qt', label: t('units.volume.quart') },
  { value: 'pt', label: t('units.volume.pint') },
  { value: 'cup', label: t('units.volume.cup') },
  { value: 'oz', label: t('units.volume.fluidOunce') },
  { value: 'tbsp', label: t('units.volume.tablespoon') },
  { value: 'tsp', label: t('units.volume.teaspoon') }
];

const VolumeConverter: React.FC = () => {
  const { t } = useLanguage();
  const volumeUnits = getVolumeUnits(t);
  const [value, setValue] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<string>('l');
  const [toUnit, setToUnit] = useState<string>('ml');
  const [result, setResult] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'error' | 'info' | 'success' | 'warning'}>({
    open: false,
    message: '',
    severity: 'error'
  });

  const handleConvert = async () => {
    if (!value) {
      setSnackbar({ open: true, message: t('common.pleaseEnterValue'), severity: 'error' });
      setResult('');
      return;
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setSnackbar({ open: true, message: t('common.pleaseEnterValidNumber'), severity: 'error' });
      setResult('');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${getAPI()}/api/convert/volume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: numValue,
          from: fromUnit,
          to: toUnit,
        }),
      });
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(t('common.serverError'));
      }
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t('common.conversionFailed'));
      }
      const resultNum = typeof data.result === 'string' ? parseFloat(data.result) : data.result;
      setResult(resultNum.toFixed(6));
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || t('common.conversionFailedPleaseTryAgain'), severity: 'error' });
      setResult('');
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
      title={t('converters.volume.title')}
      description={t('converters.volume.description')}
      icon="🧪"
    >
      <Stack spacing={3} width="100%">
        <TextField
          fullWidth
          label={t('common.inputValue')}
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
            {volumeUnits.map((unit) => (
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
            {volumeUnits.map((unit) => (
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
              {result} {volumeUnits.find(u => u.value === toUnit)?.label}
            </Typography>
            {lastUpdated && (
              <Typography variant="body2" color="text.secondary">
                {t('common.lastUpdated')}: {lastUpdated}
              </Typography>
            )}
          </Box>
        )}
      </Stack>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ConverterLayout>
  );
};

export default VolumeConverter; 