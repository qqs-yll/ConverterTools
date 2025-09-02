import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Stack,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { language, setLanguage, t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState<null | HTMLElement>(null);

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang: 'en' | 'zh') => {
    setLanguage(lang);
    handleLanguageMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const navigationItems = [
    { path: '/', label: t('nav.home'), key: 'home' },
    { path: '/currency', label: t('nav.currency'), key: 'currency' },
    { path: '/volume', label: t('nav.volume'), key: 'volume' },
    { path: '/weight', label: t('nav.weight'), key: 'weight' },
    { path: '/length', label: t('nav.length'), key: 'length' },
    { path: '/temperature', label: t('nav.temperature'), key: 'temperature' },
    { path: '/timezone', label: t('nav.timezone'), key: 'timezone' },
    { path: '/mp4-to-mp3', label: t('nav.mp4ToMp3'), key: 'mp4-to-mp3' },
    { path: '/png-to-jpg', label: t('nav.pngToJpg'), key: 'png-to-jpg' },
    { path: '/image-to-pdf', label: t('nav.imageToPdf'), key: 'image-to-pdf' }
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: 0,
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
            <Avatar
              src="/logo512.png"
              alt="Logo"
              sx={{ 
                width: 40, 
                height: 40, 
                mr: 2,
                border: '2px solid rgba(255,255,255,0.2)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              {t('app.title')}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {!isMobile ? (
            <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.key}
                  component={Link}
                  to={item.path}
                  variant={isActivePath(item.path) ? "contained" : "text"}
                  sx={{
                    color: isActivePath(item.path) ? 'primary.contrastText' : 'white',
                    backgroundColor: isActivePath(item.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                    borderRadius: '20px',
                    px: 2,
                    py: 0.5,
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    minWidth: 'auto',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255,255,255,0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      border: '1px solid rgba(255,255,255,0.2)',
                    },
                    '&:active': {
                      transform: 'translateY(0px)',
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          ) : (
            <IconButton
              color="inherit"
              onClick={handleMobileMenuOpen}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <IconButton
            color="inherit"
            onClick={handleLanguageMenuOpen}
            sx={{
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
              }
            }}
          >
            <LanguageIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleLanguageMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem 
              onClick={() => handleLanguageChange('zh')}
              selected={language === 'zh'}
            >
              中文
            </MenuItem>
            <MenuItem 
              onClick={() => handleLanguageChange('en')}
              selected={language === 'en'}
            >
              English
            </MenuItem>
          </Menu>

          <Menu
            anchorEl={mobileMenuAnchor}
            open={Boolean(mobileMenuAnchor)}
            onClose={handleMobileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1,
                maxHeight: '60vh',
                minWidth: 200,
              }
            }}
          >
            {navigationItems.map((item) => (
              <MenuItem
                key={item.key}
                component={Link}
                to={item.path}
                onClick={handleMobileMenuClose}
                selected={isActivePath(item.path)}
                sx={{
                  py: 1.5,
                  fontSize: '0.9rem',
                }}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default MainLayout; 