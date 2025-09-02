import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Paper,
  Stack,
  Divider,
  IconButton,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Image as ImageIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  KeyboardArrowUp as MoveUpIcon,
  KeyboardArrowDown as MoveDownIcon,
  PictureAsPdf as PdfIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useLanguage } from '../contexts/LanguageContext';
import ConverterLayout from '../components/ConverterLayout';

// 引入jsPDF相关类型
declare global {
  interface Window {
    jspdf: {
      jsPDF: any;
    };
  }
}

interface FileItem {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'converting' | 'completed' | 'error';
  progress: number;
  downloadUrl?: string;
  error?: string;
  preview?: string;
}

interface PdfSettings {
  pageSize: 'A4' | 'A3' | 'A5' | 'Letter' | 'Legal';
  imageQuality: number;
  fitToPage: boolean;
}

const ImageToPdfConverter: React.FC = () => {
  const { t } = useLanguage();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<PdfSettings>({
    pageSize: 'A4',
    imageQuality: 85,
    fitToPage: true
  });
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
      'image/*': ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.gif']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024 // 10MB limit per image
  });

  // 加载图片到canvas
  const loadImageToCanvas = (imageUrl: string): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error(t('imageToPdfConverter.cannotCreate2DContext')));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      };
      img.onerror = () => reject(new Error(t('imageToPdfConverter.imageLoadFailed')));
      img.src = imageUrl;
    });
  };

  // 纯前端生成PDF
  const generatePdfClientSide = async (): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        // 动态加载jsPDF
        if (!window.jspdf) {
          await new Promise((loadResolve, loadReject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => loadResolve(undefined);
            script.onerror = () => loadReject(new Error(t('imageToPdfConverter.jsPdfLoadFailed')));
            document.head.appendChild(script);
          });
        }

        const { jsPDF } = window.jspdf;
        
        // 页面尺寸配置（以毫米为单位）
        const pageSizes = {
          A4: [210, 297],
          A3: [297, 420],
          A5: [148, 210],
          Letter: [215.9, 279.4],
          Legal: [215.9, 355.6]
        };

        const [pageWidth, pageHeight] = pageSizes[settings.pageSize];
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [pageWidth, pageHeight]
        });

        // 边距
        const margin = 10;
        const availableWidth = pageWidth - 2 * margin;
        const availableHeight = pageHeight - 2 * margin;

        let isFirstPage = true;

        for (let i = 0; i < files.length; i++) {
          const fileItem = files[i];
          
          if (!isFirstPage) {
            doc.addPage();
          }
          
          try {
            const canvas = await loadImageToCanvas(fileItem.preview!);
            const imgData = canvas.toDataURL('image/jpeg', settings.imageQuality / 100);
            
            // 计算图片尺寸
            let imgWidth = canvas.width * 0.264583; // 像素转毫米
            let imgHeight = canvas.height * 0.264583;
            
            if (settings.fitToPage) {
              // 按比例缩放以适应页面
              const widthRatio = availableWidth / imgWidth;
              const heightRatio = availableHeight / imgHeight;
              const ratio = Math.min(widthRatio, heightRatio);
              
              imgWidth *= ratio;
              imgHeight *= ratio;
            } else {
              // 如果超出页面，按比例缩放
              if (imgWidth > availableWidth) {
                const ratio = availableWidth / imgWidth;
                imgWidth = availableWidth;
                imgHeight *= ratio;
              }
              if (imgHeight > availableHeight) {
                const ratio = availableHeight / imgHeight;
                imgHeight = availableHeight;
                imgWidth *= ratio;
              }
            }
            
            // 居中放置
            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;
            
            doc.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
            isFirstPage = false;
            
          } catch (error) {
            console.error(`处理图片 ${fileItem.file.name} 时出错:`, error);
          }
        }

        // 生成PDF数据URL
        const pdfDataUrl = doc.output('dataurlstring');
        resolve(pdfDataUrl);
        
      } catch (error) {
        reject(error);
      }
    });
  };

  const generatePdf = async () => {
    if (files.length === 0) {
      setSnackbar({
        open: true,
        message: t('imageToPdfConverter.pleaseSelectImages'),
        severity: 'warning'
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedPdfUrl(null);

    try {
      console.log('开始生成PDF（纯前端）...');
      const pdfDataUrl = await generatePdfClientSide();
      setGeneratedPdfUrl(pdfDataUrl);
      
      setSnackbar({
        open: true,
        message: t('imageToPdfConverter.conversionSuccess'),
        severity: 'success'
      });

    } catch (error: any) {
      console.error('PDF generation error:', error);
      
      setSnackbar({
        open: true,
        message: error.message || t('imageToPdfConverter.conversionFailed'),
        severity: 'error'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleMoveFile = (id: string, direction: 'up' | 'down') => {
    setFiles(prev => {
      const index = prev.findIndex(f => f.id === id);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newFiles = [...prev];
      [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
      return newFiles;
    });
  };

  const handleDownloadPdf = async () => {
    if (!generatedPdfUrl) return;
    
    try {
      const a = document.createElement('a');
      a.href = generatedPdfUrl;
      a.download = `images-to-pdf-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      setSnackbar({
        open: true,
        message: t('imageToPdfConverter.downloadFailed'),
        severity: 'error'
      });
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
      title={t('converters.imageToPdf.title')}
      description={t('converters.imageToPdf.description')}
      icon="📄"
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
              ? t('imageToPdfConverter.dropFilesHere')
              : t('imageToPdfConverter.dragDropFiles')
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('imageToPdfConverter.supportedFormats')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('imageToPdfConverter.maxFileSize')}
          </Typography>
        </Paper>

        {/* PDF Settings */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {t('imageToPdfConverter.pdfSettings')}
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>{t('imageToPdfConverter.pageSize')}</InputLabel>
              <Select
                value={settings.pageSize}
                label={t('imageToPdfConverter.pageSize')}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  pageSize: e.target.value as PdfSettings['pageSize'] 
                }))}
              >
                <MenuItem value="A4">A4</MenuItem>
                <MenuItem value="A3">A3</MenuItem>
                <MenuItem value="A5">A5</MenuItem>
                <MenuItem value="Letter">Letter</MenuItem>
                <MenuItem value="Legal">Legal</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ width: 200 }}>
              <Typography gutterBottom>{t('imageToPdfConverter.imageQuality')}: {settings.imageQuality}%</Typography>
              <Slider
                value={settings.imageQuality}
                onChange={(_, value) => setSettings(prev => ({ 
                  ...prev, 
                  imageQuality: value as number 
                }))}
                min={10}
                max={100}
                step={5}
                marks={[
                  { value: 50, label: '50%' },
                  { value: 85, label: '85%' },
                  { value: 100, label: '100%' }
                ]}
              />
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.fitToPage}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    fitToPage: e.target.checked 
                  }))}
                />
              }
              label={t('imageToPdfConverter.fitToPage')}
            />
          </Stack>
        </Paper>

        {/* Images List */}
        {files.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('imageToPdfConverter.imageList')} ({files.length})
            </Typography>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              {t('imageToPdfConverter.reorderInstructions')}
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Stack spacing={2}>
              {files.map((fileItem, index) => (
                <Paper key={fileItem.id} variant="outlined" sx={{ p: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {/* Preview */}
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 1,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'grey.100'
                      }}
                    >
                      {fileItem.preview ? (
                        <img
                          src={fileItem.preview}
                          alt="Preview"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <ImageIcon color="disabled" />
                      )}
                    </Box>
                    
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" noWrap>
                        {t('imageToPdfConverter.pagePrefix')} {index + 1} 页: {fileItem.file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(fileItem.file.size)}
                      </Typography>
                    </Box>
                    
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleMoveFile(fileItem.id, 'up')}
                        disabled={index === 0}
                        title={t('imageToPdfConverter.moveUpTitle')}
                      >
                        <MoveUpIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleMoveFile(fileItem.id, 'down')}
                        disabled={index === files.length - 1}
                        title={t('imageToPdfConverter.moveDownTitle')}
                      >
                        <MoveDownIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveFile(fileItem.id)}
                        title={t('imageToPdfConverter.deleteTitle')}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>
        )}

        {/* Generate PDF Button */}
        {files.length > 0 && (
          <Button
            variant="contained"
            size="large"
            onClick={generatePdf}
            disabled={isGenerating}
            startIcon={isGenerating ? <LinearProgress /> : <PdfIcon />}
            sx={{ alignSelf: 'center' }}
          >
            {isGenerating ? t('imageToPdfConverter.converting') : `${t('imageToPdfConverter.generatePdf')} (${files.length} 张图片)`}
          </Button>
        )}

        {/* Generated PDF Download */}
        {generatedPdfUrl && (
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.50' }}>
            <PdfIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom color="success.main">
              {t('imageToPdfConverter.pdfGeneratedSuccess')}
            </Typography>
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleDownloadPdf}
              startIcon={<DownloadIcon />}
            >
              {t('imageToPdfConverter.download')}
            </Button>
          </Paper>
        )}

        {/* Info Section */}
        <Paper sx={{ p: 3, bgcolor: 'primary.50' }}>
          <Typography variant="h6" gutterBottom color="primary">
            {t('imageToPdfConverter.pdfGenerationTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary" component="div">
            {t('imageToPdfConverter.pdfGenerationFeatures').split('\n').map((line, index) => (
              <Typography key={index} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {line}
              </Typography>
            ))}
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

export default ImageToPdfConverter;
