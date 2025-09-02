import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Paper,
  Stack,
  Chip,
  IconButton,
  Snackbar
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Image as ImageIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useLanguage } from '../contexts/LanguageContext';
import ConverterLayout from '../components/ConverterLayout';
import { trackConversion, trackUserInteraction } from '../utils/analytics';

interface FileItem {
  file: File;
  id: string;
  status: 'pending' | 'converting' | 'completed' | 'error';
  progress: number;
  downloadUrl?: string;
  error?: string;
  preview?: string;
}

const PngToJpgConverter: React.FC = () => {
  const { t } = useLanguage();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: FileItem[] = acceptedFiles.map(file => {
      const fileItem: FileItem = {
        file,
        id: Math.random().toString(36).substr(2, 9),
        status: 'pending',
        progress: 0
      };

      // 创建预览图
      const reader = new FileReader();
      reader.onloadend = () => {
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id 
            ? { ...f, preview: reader.result as string }
            : f
        ));
      };
      reader.readAsDataURL(file);

      return fileItem;
    });
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024 // 10MB limit
  });

  // 纯前端PNG转JPG转换函数
  const convertPngToJpg = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // 设置canvas尺寸为图片尺寸
        canvas.width = img.width;
        canvas.height = img.height;

        // 填充白色背景（PNG可能有透明背景）
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // 绘制图片到canvas
          ctx.drawImage(img, 0, 0);
          
          // 转换为JPG格式的DataURL
          const jpgDataUrl = canvas.toDataURL('image/jpeg', 0.9);
          resolve(jpgDataUrl);
        } else {
          reject(new Error(t('pngToJpgConverter.cannotCreate2DContext')));
        }
      };

      img.onerror = () => {
        reject(new Error(t('pngToJpgConverter.imageLoadFailed')));
      };

      // 读取文件并设置图片源
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => {
        reject(new Error(t('pngToJpgConverter.fileReadFailed')));
      };
      reader.readAsDataURL(file);
    });
  };

  const convertFile = async (fileItem: FileItem) => {
    try {
      // 更新状态为转换中
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id 
          ? { ...f, status: 'converting', progress: 50 }
          : f
      ));

      // 使用纯前端转换
      const jpgDataUrl = await convertPngToJpg(fileItem.file);

      // 更新文件状态为完成
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id 
          ? { 
              ...f, 
              status: 'completed', 
              progress: 100,
              downloadUrl: jpgDataUrl
            }
          : f
      ));
      
      setSnackbar({
        open: true,
        message: t('pngToJpgConverter.conversionSuccess'),
        severity: 'success'
      });

      // 跟踪转换成功事件
      trackConversion('png_to_jpg', 'png', fileItem.file.size);

    } catch (error: any) {
      console.error('Conversion error:', error);
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id 
          ? { 
              ...f, 
              status: 'error', 
              progress: 0,
              error: error.message || t('pngToJpgConverter.conversionFailed')
            }
          : f
      ));
      
      setSnackbar({
        open: true,
        message: error.message || t('pngToJpgConverter.conversionFailed'),
        severity: 'error'
      });
    }
  };

  const handleConvertAll = () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    // 跟踪批量转换开始
    trackUserInteraction('batch_convert_start', 'png_to_jpg');
    
    pendingFiles.forEach(file => {
      convertFile(file);
    });
  };

  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleRetryFile = (fileItem: FileItem) => {
    setFiles(prev => prev.map(f => 
      f.id === fileItem.id 
        ? { ...f, status: 'pending', progress: 0, error: undefined, downloadUrl: undefined }
        : f
    ));
  };

  const handleDownload = async (downloadUrl: string, fileName: string) => {
    try {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName.replace(/\.png$/i, '.jpg');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      setSnackbar({
        open: true,
        message: t('pngToJpgConverter.downloadFailed'),
        severity: 'error'
      });
    }
  };

  const getStatusColor = (status: FileItem['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'converting': return 'primary';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: FileItem['status']) => {
    switch (status) {
      case 'pending': return t('pngToJpgConverter.pending');
      case 'converting': return t('pngToJpgConverter.converting');
      case 'completed': return t('pngToJpgConverter.completed');
      case 'error': return t('pngToJpgConverter.error');
      default: return '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ConverterLayout
      title={t('converters.pngToJpg.title')}
      description={t('converters.pngToJpg.description')}
      icon="🖼️"
    >
      <Stack spacing={3}>
        {/* Upload Area */}
        <Paper
          {...getRootProps()}
          sx={{
            p: 4,
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'center'
          }}
        >
          <input {...getInputProps()} />
          <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isDragActive 
              ? t('pngToJpgConverter.dropFilesHere')
              : t('pngToJpgConverter.dragDropFiles')
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('pngToJpgConverter.supportedFormats')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('pngToJpgConverter.maxFileSize')}
          </Typography>
        </Paper>

        {/* Convert All Button */}
        {files.length > 0 && (
          <Button
            variant="contained"
            size="large"
            onClick={handleConvertAll}
            disabled={!files.some(f => f.status === 'pending')}
            startIcon={<ImageIcon />}
            sx={{ alignSelf: 'center' }}
          >
            {t('pngToJpgConverter.convertAll')} ({files.filter(f => f.status === 'pending').length})
          </Button>
        )}

        {/* Files List */}
        {files.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('pngToJpgConverter.fileList')} ({files.length})
            </Typography>
            <Stack spacing={2}>
              {files.map((fileItem) => (
                <Paper key={fileItem.id} sx={{ p: 2 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    {/* Preview */}
                    {fileItem.preview && (
                      <Box
                        component="img"
                        src={fileItem.preview}
                        sx={{
                          width: 60,
                          height: 60,
                          objectFit: 'cover',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      />
                    )}
                    
                    {/* File Info */}
                    <Box flex={1}>
                      <Typography variant="subtitle2" gutterBottom>
                        {fileItem.file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(fileItem.file.size)}
                      </Typography>
                      
                      {/* Progress Bar */}
                      {fileItem.status === 'converting' && (
                        <LinearProgress 
                          variant="determinate" 
                          value={fileItem.progress} 
                          sx={{ mt: 1 }}
                        />
                      )}
                      
                      {/* Error Message */}
                      {fileItem.error && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                          {fileItem.error}
                        </Alert>
                      )}
                    </Box>
                    
                    {/* Status & Actions */}
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip 
                        label={getStatusText(fileItem.status)}
                        color={getStatusColor(fileItem.status)}
                        size="small"
                      />
                      
                      {fileItem.status === 'completed' && fileItem.downloadUrl && (
                        <IconButton
                          color="primary"
                          onClick={() => handleDownload(fileItem.downloadUrl!, fileItem.file.name)}
                          title={t('pngToJpgConverter.download')}
                        >
                          <DownloadIcon />
                        </IconButton>
                      )}
                      
                      {fileItem.status === 'error' && (
                        <IconButton
                          color="primary"
                          onClick={() => handleRetryFile(fileItem)}
                          title={t('pngToJpgConverter.retry')}
                        >
                          <RefreshIcon />
                        </IconButton>
                      )}
                      
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveFile(fileItem.id)}
                        title={t('pngToJpgConverter.remove')}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}

        {/* Info Section */}
        <Paper sx={{ p: 3, bgcolor: 'primary.50' }}>
          <Typography variant="h6" gutterBottom color="primary">
            {t('pngToJpgConverter.infoTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('pngToJpgConverter.infoDescription')}
            <br />
            {t('pngToJpgConverter.infoDescription2')}
            <br />
            {t('pngToJpgConverter.infoDescription3')}
            <br />
            {t('pngToJpgConverter.infoDescription4')}
          </Typography>
        </Paper>
      </Stack>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ConverterLayout>
  );
};

export default PngToJpgConverter;
