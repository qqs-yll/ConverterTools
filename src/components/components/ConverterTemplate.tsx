import React, { ReactNode } from 'react';
import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useLanguage } from '../../contexts/LanguageContext';

interface ConverterTemplateProps {
  title: string;
  description: string;
  icon: string;
  children: ReactNode;
  onConvert?: () => void;
  onFileSelect?: (file: File) => void;
  isLoading?: boolean;
  error?: string;
}

const ConverterTemplate: React.FC<ConverterTemplateProps> = ({
  title,
  description,
  icon,
  children,
  onConvert,
  onFileSelect,
  isLoading = false,
  error,
}) => {
  const { t } = useLanguage();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ mr: 1 }}>
            {icon} {title}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>

        {onFileSelect && (
          <Box sx={{ mb: 3 }}>
            <input
              accept="*/*"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
              >
                {t('common.selectFile')}
              </Button>
            </label>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {children}

        {onConvert && (
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={onConvert}
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? t('common.converting') : t('common.startConversion')}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ConverterTemplate; 