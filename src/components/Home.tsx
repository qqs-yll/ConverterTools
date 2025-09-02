import React from 'react';
import { Box, Typography, Paper, Avatar, Container, useTheme, alpha } from '@mui/material';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Speed as SpeedIcon, 
  CheckCircle as CheckCircleIcon, 
  FormatListBulleted as UnitsIcon, 
  TouchApp as InterfaceIcon,
  Build as BuildIcon,
  SportsEsports as GameIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon2,
  Verified as VerifiedIcon,
  AutoAwesome as AutoAwesomeIcon
} from '@mui/icons-material';
import AnimatedBackground from '../components/AnimatedBackground';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const theme = useTheme();

  const tools = [
    { 
      titleKey: 'converters.currency.title', 
      descriptionKey: 'converters.currency.description', 
      path: '/converter/currency', 
      icon: '💱' 
    },
    { 
      titleKey: 'converters.volume.title', 
      descriptionKey: 'converters.volume.description', 
      path: '/converter/volume', 
      icon: '📦' 
    },
    { 
      titleKey: 'converters.weight.title', 
      descriptionKey: 'converters.weight.description', 
      path: '/converter/weight', 
      icon: '⚖️' 
    },
    { 
      titleKey: 'converters.length.title', 
      descriptionKey: 'converters.length.description', 
      path: '/converter/length', 
      icon: '📏' 
    },
    { 
      titleKey: 'converters.temperature.title', 
      descriptionKey: 'converters.temperature.description', 
      path: '/converter/temperature', 
      icon: '🌡️' 
    },
    { 
      titleKey: 'converters.timezone.title', 
      descriptionKey: 'converters.timezone.description', 
      path: '/converter/timezone', 
      icon: '🌍' 
    },
    { 
      titleKey: 'converters.mp4ToMp3.title', 
      descriptionKey: 'converters.mp4ToMp3.description', 
      path: '/converter/mp4-to-mp3', 
      icon: '🎵' 
    },
    { 
      titleKey: 'converters.imageToPdf.title', 
      descriptionKey: 'converters.imageToPdf.description', 
      path: '/converter/image-to-pdf', 
      icon: '📄' 
    },
    { 
      titleKey: 'converters.pngToJpg.title', 
      descriptionKey: 'converters.pngToJpg.description', 
      path: '/converter/png-to-jpg', 
      icon: '🖼️' 
    }
  ];

  const features = [
    {
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      titleKey: 'features.items.accuracy.title',
      descriptionKey: 'features.items.accuracy.description'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      titleKey: 'features.items.speed.title',
      descriptionKey: 'features.items.speed.description'
    },
    {
      icon: <UnitsIcon sx={{ fontSize: 40 }} />,
      titleKey: 'features.items.units.title',
      descriptionKey: 'features.items.units.description'
    },
    {
      icon: <InterfaceIcon sx={{ fontSize: 40 }} />,
      titleKey: 'features.items.interface.title',
      descriptionKey: 'features.items.interface.description'
    }
  ];

  const playerFeatures = [
    { icon: <GameIcon />, key: 'feature1' },
    { icon: <StorageIcon />, key: 'feature2' },
    { icon: <SpeedIcon2 />, key: 'feature3' },
    { icon: <VerifiedIcon />, key: 'feature4' },
    { icon: <BuildIcon />, key: 'feature5' },
    { icon: <AutoAwesomeIcon />, key: 'feature6' }
  ];

  const testimonials = [
    {
      nameKey: 'testimonials.items.user1.name',
      roleKey: 'testimonials.items.user1.role',
      textKey: 'testimonials.items.user1.text',
      avatar: '👨‍💼'
    },
    {
      nameKey: 'testimonials.items.user2.name',
      roleKey: 'testimonials.items.user2.role',
      textKey: 'testimonials.items.user2.text',
      avatar: '👩‍🎓'
    },
    {
      nameKey: 'testimonials.items.user3.name',
      roleKey: 'testimonials.items.user3.role',
      textKey: 'testimonials.items.user3.text',
      avatar: '👨‍💻'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <AnimatedBackground />
        <Box sx={{ 
          py: 4, 
          px: 2,
          background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.default, 0)} 100%)`
        }}>
          <Container maxWidth="lg">
            {/* Welcome Section */}
            <Box
              sx={{ 
                textAlign: 'center', 
                mb: 8,
                animation: 'fadeInDown 0.6s ease-out'
              }}
            >
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, // 移动端字体调整
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {t('common.welcome')}
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  mb: 6, 
                  maxWidth: '800px', 
                  mx: 'auto',
                  fontSize: { xs: '1rem', sm: '1.25rem' }, // 移动端字体调整
                  px: { xs: 2, sm: 0 } // 移动端增加水平内边距
                }}
              >
                {t('common.selectTool')}
              </Typography>
            </Box>

            {/* Tools Grid */}
            <Box sx={{ 
              display: 'grid', 
              gap: { xs: 2, sm: 4 }, 
              gridTemplateColumns: { 
                xs: 'repeat(3, 1fr)', // 移动端3×3网格
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(2, 1fr)', 
                lg: 'repeat(3, 1fr)' 
              },
              mb: 8
            }}>
              {tools.map((tool, index) => (
              <Link key={tool.path} href={tool.path} passHref>
                  <Paper
                    sx={{
                      // 桌面端样式保持不变
                      p: { xs: 2, sm: 4 },
                      height: { xs: '140px', sm: '290px' }, // 移动端稍微增加高度以容纳标题
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center', // 移动端居中
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      // 移动端去掉白色背景，只在桌面端显示
                      background: { 
                        xs: 'transparent', // 移动端透明背景
                        sm: 'rgba(255, 255, 255, 0.95)' 
                      },
                      backdropFilter: { xs: 'none', sm: 'blur(10px)' },
                      position: 'relative',
                      overflow: 'hidden',
                      animation: 'fadeInUp 0.5s ease-out',
                      animationFillMode: 'both',
                      animationDelay: `${index * 0.1}s`,
                      // 移动端简化悬停效果
                      '&:hover': {
                        transform: { xs: 'scale(1.1)', sm: 'translateY(-12px)' },
                        boxShadow: { xs: 'none', sm: '0 16px 40px rgba(0,0,0,0.2)' },
                        '& .icon': {
                          transform: 'scale(1.2)',
                        },
                        '&::before': {
                          height: { xs: '0', sm: '6px' },
                          background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                        }
                      },
                      // 移动端隐藏顶部装饰线
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: { xs: '0', sm: '4px' },
                        background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                      },
                      // 移动端去掉边框和阴影
                      boxShadow: { xs: 'none', sm: 2 },
                      border: { xs: 'none', sm: 'default' }
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <Typography 
                        className="icon"
                        variant="h1" 
                        sx={{ 
                          fontSize: { xs: '2.5rem', sm: '4.5rem' }, // 移动端图标稍小
                          mb: { xs: 1, sm: 2 },
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        {tool.icon}
                      </Typography>
                      {/* 移动端显示标题，桌面端显示标题和描述 */}
                      <Typography
                        variant="h5"
                        align="center"
                        sx={{
                          color: 'text.primary',
                          fontWeight: 'bold',
                          mb: 0,
                          minHeight: { xs: 'auto', sm: '64px' },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: { xs: '0.9rem', sm: '1.5rem' }, // 移动端字体更小
                          lineHeight: { xs: 1.2, sm: 1.4 }
                        }}
                      >
                        {t(tool.titleKey)}
                      </Typography>
                      <Typography
                        variant="body1"
                        align="center"
                        sx={{
                          display: { xs: 'none', sm: 'flex' }, // 移动端隐藏描述
                          color: 'text.secondary',
                          px: 2,
                          lineHeight: 1.6,
                          minHeight: '48px',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {t(tool.descriptionKey)}
                      </Typography>
                    </Box>
                  </Paper>
                </Link>
              ))}
            </Box>

            {/* Features Section */}
            <Box sx={{ mb: 8 }}>
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom 
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, // 移动端字体调整
                  animation: 'fadeInDown 0.6s ease-out'
                }}
              >
                {t('features.title')}
              </Typography>
              <Typography 
                variant="subtitle1" 
                gutterBottom 
                align="center" 
                color="text.secondary" 
                sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}
              >
                {t('features.description')}
              </Typography>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { 
                  xs: 'repeat(2, 1fr)', // 移动端2×2网格
                  sm: 'repeat(2, 1fr)', 
                  md: 'repeat(4, 1fr)' // 桌面端4列
                },
                gap: { xs: 2, sm: 4 },
                '& > *': {
                  animation: 'fadeInUp 0.5s ease-out',
                  animationFillMode: 'both'
                }
              }}>
                {features.map((feature, index) => (
                  <Box
                    key={index}
                    sx={{ 
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: { xs: 2, sm: 3 }, // 移动端减少内边距
                        height: '100%', 
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)'
                        }
                      }}
                    >
                      <Box 
                        sx={{ 
                          mb: 2, 
                          color: 'primary.main',
                          display: 'inline-block',
                          p: 2,
                          borderRadius: '50%',
                          bgcolor: alpha(theme.palette.primary.main, 0.1)
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: { xs: '0.9rem', sm: '1.25rem' } // 移动端字体稍小
                        }}
                      >
                        {t(feature.titleKey)}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' } // 移动端字体稍小
                        }}
                      >
                        {t(feature.descriptionKey)}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* How to Use Section */}
            <Box sx={{ mb: 8 }}>
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom 
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } // 移动端字体调整
                }}
              >
                {t('howToUse.title')}
              </Typography>
              <Typography 
                variant="subtitle1" 
                gutterBottom 
                align="center" 
                color="text.secondary" 
                sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}
              >
                {t('howToUse.description')}
              </Typography>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { 
                  xs: 'repeat(2, 1fr)', // 移动端2×2网格
                  sm: 'repeat(2, 1fr)', 
                  md: 'repeat(4, 1fr)' // 桌面端4列
                },
                gap: { xs: 2, sm: 2, md: 2 },
                mt: 2,
                '& > *': {
                  animation: 'fadeInUp 0.5s ease-out',
                  animationFillMode: 'both'
                }
              }}>
                {['step1', 'step2', 'step3', 'step4'].map((step, index) => (
                  <Box
                    key={index}
                    sx={{ 
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: { xs: 2, sm: 3 }, // 移动端减少内边距
                        height: '100%', 
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                        }
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        color="primary" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: { xs: '1.5rem', sm: '2rem' } // 移动端数字稍小
                        }}
                      >
                        {index + 1}
                      </Typography>
                      <Typography 
                        variant="body1"
                        sx={{
                          fontSize: { xs: '0.85rem', sm: '1rem' } // 移动端文字稍小
                        }}
                      >
                        {t(`howToUse.steps.${step}`)}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* What Players Love Section */}
            <Box sx={{ mb: 8 }}>
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom 
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } // 移动端字体调整
                }}
              >
                {t('whatPlayersLove.title')}
              </Typography>
              <Typography 
                variant="subtitle1" 
                gutterBottom 
                align="center" 
                color="text.secondary" 
                sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}
              >
                {t('whatPlayersLove.description')}
              </Typography>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { 
                  xs: 'repeat(2, 1fr)', // 移动端2×2网格
                  sm: 'repeat(2, 1fr)', 
                  md: 'repeat(3, 1fr)' // 桌面端3列
                },
                gap: { xs: 2, sm: 3 },
                '& > *': {
                  animation: 'fadeInUp 0.5s ease-out',
                  animationFillMode: 'both'
                }
              }}>
                {playerFeatures.map((feature, index) => (
                  <Box
                    key={index}
                    sx={{ 
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: { xs: 2, sm: 3 }, // 移动端减少内边距
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 1.5, sm: 2 }, // 移动端减少间距
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateX(8px)'
                        }
                      }}
                    >
                      <Box 
                        sx={{ 
                          color: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: { xs: 32, sm: 40 }, // 移动端图标稍小
                          height: { xs: 32, sm: 40 },
                          borderRadius: '50%',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          fontSize: { xs: '1.2rem', sm: '1.5rem' } // 移动端图标字体稍小
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: { xs: '0.9rem', sm: '1.25rem' } // 移动端字体稍小
                        }}
                      >
                        {t(`whatPlayersLove.features.${feature.key}`)}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Why Users Love Section */}
            <Box sx={{ mb: 8 }}>
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom 
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } // 移动端字体调整
                }}
              >
                {t('whyLove.title')}
              </Typography>
              <Typography 
                variant="subtitle1" 
                gutterBottom 
                align="center" 
                color="text.secondary" 
                sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}
              >
                {t('whyLove.description')}
              </Typography>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { 
                  xs: 'repeat(2, 1fr)', // 移动端2×2网格
                  sm: 'repeat(2, 1fr)' // 桌面端也保持2列
                },
                gap: { xs: 2, sm: 3 },
                '& > *': {
                  animation: 'fadeInUp 0.5s ease-out',
                  animationFillMode: 'both'
                }
              }}>
                {['reason1', 'reason2', 'reason3', 'reason4', 'reason5', 'reason6'].map((reason, index) => (
                  <Box
                    key={index}
                    sx={{ 
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: { xs: 2, sm: 3 }, // 移动端减少内边距
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 1.5, sm: 2 }, // 移动端减少间距
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.05)
                        }
                      }}
                    >
                      <CheckCircleIcon 
                        sx={{ 
                          color: 'primary.main',
                          fontSize: { xs: 20, sm: 28 } // 移动端图标稍小
                        }} 
                      />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: { xs: '0.9rem', sm: '1.25rem' } // 移动端字体稍小
                        }}
                      >
                        {t(`whyLove.reasons.${reason}`)}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Testimonials Section */}
            <Box sx={{ mb: { xs: 4, sm: 8 } }}> {/* 移动端减少底部间距 */}
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom 
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } // 移动端字体调整
                }}
              >
                {t('testimonials.title')}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: { xs: 2, sm: 4 }, // 移动端减少卡片间距
                justifyContent: 'center',
                '& > *': {
                  animation: 'fadeInUp 0.5s ease-out',
                  animationFillMode: 'both'
                }
              }}>
                {testimonials.map((testimonial, index) => (
                  <Box
                    key={index}
                    sx={{ 
                      flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 32px)' },
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: { xs: 2, sm: 3 }, // 移动端减少内边距
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.02)'
                        }
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: { xs: 1.5, sm: 2 }, // 移动端减少底部间距
                        gap: { xs: 1, sm: 2 } // 移动端减少头像和文字间距
                      }}>
                        <Avatar 
                          sx={{ 
                            width: { xs: 40, sm: 56 }, // 移动端头像更小
                            height: { xs: 40, sm: 56 }, 
                            fontSize: { xs: '1.5rem', sm: '2rem' }, // 移动端表情符号更小
                            bgcolor: theme.palette.primary.main
                          }}
                        >
                          {testimonial.avatar}
                        </Avatar>
                        <Box>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 'bold',
                              fontSize: { xs: '0.9rem', sm: '1.25rem' } // 移动端名字字体更小
                            }}
                          >
                            {t(testimonial.nameKey)}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              fontSize: { xs: '0.75rem', sm: '0.875rem' } // 移动端职位字体更小
                            }}
                          >
                            {t(testimonial.roleKey)}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography 
                        variant="body1"
                        sx={{ 
                          fontStyle: 'italic',
                          position: 'relative',
                          pl: { xs: 1, sm: 2 }, // 移动端减少左内边距
                          fontSize: { xs: '0.85rem', sm: '1rem' }, // 移动端评价文字更小
                          lineHeight: { xs: 1.4, sm: 1.6 }, // 移动端行高更紧凑
                          '&:before': {
                            content: '"\\201C"',
                            position: 'absolute',
                            left: { xs: -2, sm: -4 }, // 移动端引号位置调整
                            top: { xs: -4, sm: -8 },
                            color: theme.palette.primary.main,
                            fontSize: { xs: '1.8rem', sm: '2.5rem' }, // 移动端引号更小
                            opacity: 0.5
                          }
                        }}
                      >
                        {t(testimonial.textKey)}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>
            </Box>
          </Container>
        </Box>

        <style>
          {`
            @keyframes fadeInDown {
              from {
                opacity: 0;
                transform: translateY(-20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
    </Box>
  );
};

export default Home; 