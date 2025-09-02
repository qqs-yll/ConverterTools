import React from 'react';
import { Box } from '@mui/material';

const AnimatedBackground: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        overflow: 'hidden',
        background: 'linear-gradient(to bottom right, #f5f7fa 0%, #e8ecf1 100%)',
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          width: '200vw',
          height: '200vh',
          top: '-50%',
          left: '-50%',
          background: 'linear-gradient(45deg, rgba(255,0,0,0.1) 0%, rgba(255,0,255,0.1) 100%)',
          animation: 'rotate 30s linear infinite',
        },
        '&::after': {
          background: 'linear-gradient(45deg, rgba(0,255,255,0.1) 0%, rgba(0,255,0,0.1) 100%)',
          animation: 'rotate 20s linear infinite reverse',
        },
        '@keyframes rotate': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        '& .line': {
          position: 'absolute',
          width: '2px',
          height: '100%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,119,255,0.3) 50%, transparent 100%)',
          animation: 'moveLine 15s linear infinite',
          '&:nth-of-type(1)': { left: '20%', animationDelay: '0s' },
          '&:nth-of-type(2)': { left: '40%', animationDelay: '-5s' },
          '&:nth-of-type(3)': { left: '60%', animationDelay: '-10s' },
          '&:nth-of-type(4)': { left: '80%', animationDelay: '-15s' },
        },
        '@keyframes moveLine': {
          '0%': {
            transform: 'translateY(-100%)',
          },
          '100%': {
            transform: 'translateY(100%)',
          },
        },
      }}
    >
      <div className="line" />
      <div className="line" />
      <div className="line" />
      <div className="line" />
    </Box>
  );
};

export default AnimatedBackground; 