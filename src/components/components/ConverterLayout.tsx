import React from 'react';
import { Box, Container, Paper, Typography, useTheme, alpha } from '@mui/material';
import MainLayout from './MainLayout';

interface ConverterLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  icon?: string;
}

const ConverterLayout: React.FC<ConverterLayoutProps> = ({
  children,
  title,
  description,
  icon
}) => {
  const theme = useTheme();

  return (
    <MainLayout>
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)', // 减去顶部导航栏的高度
          py: 4,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.default, 0)} 100%)`
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              textAlign: 'center',
              mb: 4,
              animation: 'fadeInDown 0.6s ease-out'
            }}
          >
            {icon && (
              <Typography
                variant="h1"
                sx={{
                  fontSize: '4rem',
                  mb: 2,
                  animation: 'bounce 2s infinite'
                }}
              >
                {icon}
              </Typography>
            )}
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {title}
            </Typography>
            {description && (
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                {description}
              </Typography>
            )}
          </Box>

          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              backgroundColor: 'background.paper',
              animation: 'fadeInUp 0.6s ease-out',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8]
              }
            }}
          >
            {children}
          </Paper>
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

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-20px);
            }
            60% {
              transform: translateY(-10px);
            }
          }
        `}
      </style>
    </MainLayout>
  );
};

export default ConverterLayout; 