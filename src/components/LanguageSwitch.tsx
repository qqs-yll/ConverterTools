import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitch: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (lang: 'en' | 'zh') => {
    setLanguage(lang);
    handleClose();
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        size="large"
      >
        <TranslateIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem 
          onClick={() => handleLanguageSelect('en')}
          selected={language === 'en'}
        >
          English
        </MenuItem>
        <MenuItem 
          onClick={() => handleLanguageSelect('zh')}
          selected={language === 'zh'}
        >
          中文
        </MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSwitch; 