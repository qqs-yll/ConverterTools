import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  FormControlLabel,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  CurrencyExchange as CurrencyIcon,
  Straighten as LengthIcon,
  Scale as WeightIcon,
  Opacity as VolumeIcon,
  Thermostat as TemperatureIcon,
  AccessTime as TimezoneIcon,
  MusicNote as Mp3Icon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  key: string;
  icon: React.ReactNode;
}

// 移除了HideOnScroll组件，使导航栏在滚动时保持可见

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { t, language, setLanguage } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  // 移除了深色模式状态
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { path: '/', label: t('nav.home'), key: 'home', icon: <HomeIcon /> },
    { path: '/converter/currency', label: t('nav.currency'), key: 'currency', icon: <CurrencyIcon /> },
    { path: '/converter/volume', label: t('nav.volume'), key: 'volume', icon: <VolumeIcon /> },
    { path: '/converter/weight', label: t('nav.weight'), key: 'weight', icon: <WeightIcon /> },
    { path: '/converter/length', label: t('nav.length'), key: 'length', icon: <LengthIcon /> },
    { path: '/converter/temperature', label: t('nav.temperature'), key: 'temperature', icon: <TemperatureIcon /> },
    { path: '/converter/timezone', label: t('nav.timezone'), key: 'timezone', icon: <TimezoneIcon /> },
    { path: '/converter/mp4-to-mp3', label: t('nav.mp4ToMp3'), key: 'mp4ToMp3', icon: <Mp3Icon /> },
    { path: '/converter/image-to-pdf', label: t('nav.imageToPdf'), key: 'imageToPdf', icon: <PdfIcon /> },
    { path: '/converter/png-to-jpg', label: t('nav.pngToJpg'), key: 'pngToJpg', icon: <ImageIcon /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  // 移除了深色模式切换处理函数
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src="/logo512.png"
            alt="Logo"
            sx={{ 
              width: 40, 
              height: 40,
              border: '2px solid rgba(255,255,255,0.2)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          <Typography variant="h6" noWrap component="div">
            {t('common.appTitle')}
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.key}
            component={Link}
            href={item.path}
            onClick={handleDrawerToggle}
            sx={{
              color: isActive(item.path) ? 'primary.main' : 'inherit',
              backgroundColor: isActive(item.path) ? 'action.selected' : 'transparent',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={language === 'zh'}
              onChange={handleLanguageToggle}
              icon={<LanguageIcon />}
              checkedIcon={<LanguageIcon />}
            />
          }
          label={language === 'en' ? '中文' : 'English'}
        />
        {/* 移除了深色模式切换控件 */}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={1}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
              {/* 左侧：Logo + 应用标题 */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                flexShrink: 0
              }}>
                {/* Logo */}
                <Avatar
                  src="/logo512.png"
                  alt="Logo"
                  component={Link}
                  href="/"
                  sx={{ 
                    width: 40, 
                    height: 40,
                    border: '2px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      transition: 'transform 0.2s ease'
                    }
                  }}
                />
                
                {/* 应用标题 */}
                <Typography
                  variant="h6"
                  noWrap
                  component={Link}
                  href="/"
                  sx={{
                    fontWeight: 700,
                    color: 'inherit',
                    textDecoration: 'none',
                    display: { xs: 'none', md: 'block' },
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8,
                      transition: 'opacity 0.2s ease'
                    }
                  }}
                >
                  {t('common.appTitle')}
                </Typography>
              </Box>

              {/* 中间：导航按钮组 */}
              <Box sx={{ 
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 1,
                flexGrow: 1,
                justifyContent: 'center',
                ml: -4 // 向左移动一点
              }}>
                {navItems.map((item) => (
                  <Tooltip key={item.key} title={item.label} arrow>
                    <Button
                      component={Link}
                      href={item.path}
                      sx={{
                        color: 'white',
                        backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                        borderRadius: '20px',
                        px: 2,
                        py: 1,
                        minWidth: 'auto',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        },
                      }}
                    >
                      {/* 图标在上，文字在下 */}
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        gap: 0.5
                      }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '1.2rem'
                        }}>
                          {item.icon}
                        </Box>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontSize: '0.7rem',
                            lineHeight: 1,
                            textAlign: 'center'
                          }}
                        >
                          {item.label}
                        </Typography>
                      </Box>
                    </Button>
                  </Tooltip>
                ))}
              </Box>

              {/* 右侧：语言和主题切换 */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title={language === 'en' ? '切换到中文' : 'Switch to English'} arrow>
                  <IconButton
                    onClick={handleLanguageToggle}
                    sx={{ 
                      color: 'white',
                      mx: { xs: 0, md: 0.5 }, // 电脑端减少左边距
                      ml: { xs: 2, md: 0 } // 移动端增加右边距
                    }}
                  >
                    <LanguageIcon />
                  </IconButton>
                </Tooltip>
                {/* 移除了深色模式切换按钮 */}
                {/* 移动端菜单按钮 */}
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ 
                    display: { xs: 'block', md: 'none' },
                    ml: 1
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default MainLayout; 