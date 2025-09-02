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
  Chip,
  IconButton,
  Snackbar
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  VideoFile as VideoIcon,
  MusicNote as AudioIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useLanguage } from '../contexts/LanguageContext';
import ConverterLayout from '../components/ConverterLayout';
import { getFileConversionAPI } from '../config';

interface FileItem {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'converting' | 'completed' | 'error';
  progress: number;
  downloadUrl?: string;
  error?: string;
}

const Mp4ToMp3Converter: React.FC = () => {
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
    const newFiles: FileItem[] = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      progress: 0
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv']
    },
    multiple: true,
    maxSize: 100 * 1024 * 1024 // 100MB limit
  });

  const extractAudioFromVideo = async (videoFile: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      video.src = URL.createObjectURL(videoFile);
      video.crossOrigin = 'anonymous';
      
      video.addEventListener('loadedmetadata', async () => {
        try {
          // 创建音频处理节点
          const source = audioContext.createMediaElementSource(video);
          const destination = audioContext.createMediaStreamDestination();
          source.connect(destination);
          
          // 使用MediaRecorder录制音频
          const mediaRecorder = new MediaRecorder(destination.stream, {
            mimeType: 'audio/webm'
          });
          
          const chunks: BlobPart[] = [];
          
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunks.push(event.data);
            }
          };
          
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(chunks, { type: 'audio/webm' });
            resolve(audioBlob);
            URL.revokeObjectURL(video.src);
          };
          
          mediaRecorder.onerror = (event) => {
            reject(new Error(t('mp4Converter.recordingFailed')));
          };
          
          // 开始录制
          mediaRecorder.start();
          video.play();
          
          // 当视频播放结束时停止录制
          video.addEventListener('ended', () => {
            mediaRecorder.stop();
          });
          
        } catch (error) {
          reject(error);
        }
      });
      
      video.addEventListener('error', () => {
        reject(new Error(t('mp4Converter.videoLoadFailed')));
      });
    });
  };

  const convertFile = async (fileItem: FileItem) => {
    try {
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id 
          ? { ...f, status: 'uploading', progress: 0 }
          : f
      ));

      // 首先尝试使用后端API进行转换
      try {
        const formData = new FormData();
        formData.append('video', fileItem.file);

        const response = await fetch(`${getFileConversionAPI()}/api/convert-mp4-to-mp3`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          
          setFiles(prev => prev.map(f => 
            f.id === fileItem.id 
              ? { 
                  ...f, 
                  status: 'completed', 
                  progress: 100,
                  downloadUrl: `${getFileConversionAPI()}${result.downloadUrl}`
                }
              : f
          ));
          
          setSnackbar({
            open: true,
            message: t('mp4Converter.conversionSuccess'),
            severity: 'success'
          });
          
          return; // 成功，直接返回
        }
      } catch (apiError) {
        console.warn(t('mp4Converter.backendApiFailed'), apiError);
      }

      // 如果后端API失败，使用客户端转换
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id 
          ? { ...f, status: 'converting', progress: 0 }
          : f
      ));

      // 模拟进度更新
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === fileItem.id && f.progress < 90) {
            return { ...f, progress: f.progress + 10 };
          }
          return f;
        }));
      }, 500);

      // 进行客户端音频提取
      const audioBlob = await extractAudioFromVideo(fileItem.file);
      
      clearInterval(progressInterval);
      
      // 创建下载URL
      const downloadUrl = URL.createObjectURL(audioBlob);

      setFiles(prev => prev.map(f => 
        f.id === fileItem.id 
          ? { 
              ...f, 
              status: 'completed', 
              progress: 100,
              downloadUrl: downloadUrl
            }
          : f
      ));
      
      setSnackbar({
        open: true,
        message: t('mp4Converter.conversionSuccess') + ' (客户端转换)',
        severity: 'success'
      });

    } catch (error: any) {
      console.error('Conversion error:', error);
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id 
          ? { 
              ...f, 
              status: 'error', 
              progress: 0,
              error: error.message || t('mp4Converter.conversionFailed')
            }
          : f
      ));
      
      setSnackbar({
        open: true,
        message: error.message || t('mp4Converter.conversionFailed'),
        severity: 'error'
      });
    }
  };

  const handleConvertAll = () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
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
      a.download = fileName.replace(/\.[^/.]+$/, '') + '.webm'; // 使用webm格式
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      setSnackbar({
        open: true,
        message: t('mp4Converter.downloadFailed'),
        severity: 'error'
      });
    }
  };

  const getStatusColor = (status: FileItem['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'converting': 
      case 'uploading': return 'primary';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: FileItem['status']) => {
    switch (status) {
      case 'pending': return t('mp4Converter.pending');
      case 'uploading': return t('mp4Converter.uploading');
      case 'converting': return t('mp4Converter.converting');
      case 'completed': return t('mp4Converter.completed');
      case 'error': return t('mp4Converter.error');
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
      title={t('mp4Converter.title')}
      description={t('mp4Converter.description')}
      icon="🎵"
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
              ? t('mp4Converter.dropFilesHere')
              : t('mp4Converter.dragDropFiles')
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('mp4Converter.supportedFormats')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('mp4Converter.maxFileSize')}
          </Typography>
        </Paper>

        {/* Convert All Button */}
        {files.length > 0 && (
          <Button
            variant="contained"
            size="large"
            onClick={handleConvertAll}
            disabled={!files.some(f => f.status === 'pending')}
            startIcon={<AudioIcon />}
            sx={{ alignSelf: 'center' }}
          >
            {t('mp4Converter.convertAll')} ({files.filter(f => f.status === 'pending').length})
          </Button>
        )}

        {/* Files List */}
        {files.length > 0 && (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('mp4Converter.fileList')} ({files.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Stack spacing={2}>
              {files.map((fileItem) => (
                <Paper
                  key={fileItem.id}
                  variant="outlined"
                  sx={{ p: 2 }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <VideoIcon color="primary" />
                    
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" noWrap>
                        {fileItem.file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(fileItem.file.size)}
                      </Typography>
                    </Box>

                    <Chip
                      label={getStatusText(fileItem.status)}
                      color={getStatusColor(fileItem.status)}
                      size="small"
                    />

                    <Stack direction="row" spacing={1}>
                      {fileItem.status === 'completed' && fileItem.downloadUrl && (
                        <IconButton
                          color="success"
                          onClick={() => handleDownload(fileItem.downloadUrl!, fileItem.file.name)}
                          title={t('mp4Converter.download')}
                        >
                          <DownloadIcon />
                        </IconButton>
                      )}
                      
                      {fileItem.status === 'error' && (
                        <IconButton
                          color="primary"
                          onClick={() => handleRetryFile(fileItem)}
                          title={t('mp4Converter.retry')}
                        >
                          <RefreshIcon />
                        </IconButton>
                      )}
                      
                      {!['converting', 'uploading'].includes(fileItem.status) && (
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveFile(fileItem.id)}
                          title={t('mp4Converter.remove')}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </Stack>

                  {/* Progress Bar */}
                  {['uploading', 'converting'].includes(fileItem.status) && (
                    <Box sx={{ mt: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ flexGrow: 1 }}>
                          <LinearProgress
                            variant={fileItem.status === 'converting' ? 'determinate' : 'indeterminate'}
                            value={fileItem.progress}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                        {fileItem.status === 'converting' && (
                          <Typography variant="caption">
                            {fileItem.progress}%
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  )}

                  {/* Error Message */}
                  {fileItem.status === 'error' && fileItem.error && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {fileItem.error}
                    </Alert>
                  )}
                </Paper>
              ))}
            </Stack>
          </Paper>
        )}

        {/* Info Section */}
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            {t('mp4Converter.noteMessage')}
          </Typography>
        </Alert>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ConverterLayout>
  );
};

export default Mp4ToMp3Converter;
