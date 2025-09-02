import React, { useState } from 'react';
import { TextField, Button, Typography, Box, CircularProgress, Alert } from '@mui/material';
import ConverterLayout from './ConverterLayout';

const TimezoneConverter: React.FC = () => {
  const [dateTime, setDateTime] = useState<string>('');
  const [fromTimezone, setFromTimezone] = useState<string>('');
  const [toTimezone, setToTimezone] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!dateTime || !fromTimezone || !toTimezone) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/convert/timezone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateTime,
          fromTimezone,
          toTimezone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Conversion failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Conversion failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConverterLayout title="Timezone Converter">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Date and Time"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          placeholder="2025-04-30 12:38"
          fullWidth
        />
        <TextField
          label="From Timezone"
          value={fromTimezone}
          onChange={(e) => setFromTimezone(e.target.value)}
          placeholder="e.g., UTC, Asia/Shanghai, America/New_York"
          fullWidth
        />
        <TextField
          label="To Timezone"
          value={toTimezone}
          onChange={(e) => setToTimezone(e.target.value)}
          placeholder="e.g., UTC, Asia/Shanghai, America/New_York"
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleConvert}
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Convert'}
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
        {result && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Result:</Typography>
            <Typography>Original: {result.original}</Typography>
            <Typography>Converted: {result.converted}</Typography>
          </Box>
        )}
      </Box>
    </ConverterLayout>
  );
};

export default TimezoneConverter; 