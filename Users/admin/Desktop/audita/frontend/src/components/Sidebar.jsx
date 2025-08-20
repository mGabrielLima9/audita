import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  IconButton,
  Typography,
  Box,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  Search as SearchIcon,
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
  Description as DescriptionIcon,
  Payment as PaymentIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';

const drawerWidth = 250;

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({
    simplesNacional: false,
    mei: false
  });
  const location = useLocation();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMenuToggle = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #e9ecef',
          height: '100vh',
          overflowY: 'hidden',
          transition: theme.transitions.create(['width', 'background-color'], {
            duration: theme.transitions.duration.standard,
          }),
        },
      }}
    >
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderBottom: '1px solid #e9ecef'
      }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Roboto", "Arial", sans-serif',
            fontSize: '1rem',
            fontWeight: 500,
            color: '#343a40'
          }}
        >
          Auditor Digital
        </Typography>
      </Box>

      <List sx={{ mt: 2 }}>
        <ListItemButton
          component={Link}
          to="/dashboard"
          selected={isActive('/dashboard')}
          sx={{
            py: 1.5,
            px: 2,
            '&.Mui-selected': {
              backgroundColor: '#1976d2',
              color: '#fff',
              '& .MuiListItemIcon-root': {
                color: '#fff'
              },
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            },
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
              transition: 'background-color 0.2s'
            }
          }}
        >
          <ListItemIcon sx={{
            minWidth: 40,
            color: isActive('/dashboard') ? '#fff' : '#6c757d'
          }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText
            primary="Dashboard"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontFamily: '"Roboto", "Arial", sans-serif'
            }}
          />
        </ListItemButton>

        <Box sx={{ mt: 2, mb: 1, px: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: '#6c757d',
              fontSize: '0.75rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}
          >
            SIMPLES NACIONAL
          </Typography>
        </Box>

        <ListItemButton
          onClick={() => handleMenuToggle('simplesNacional')}
          sx={{
            py: 1.5,
            px: 2,
            color: '#495057',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
              transition: 'background-color 0.2s'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: '#6c757d' }}>
            <BusinessIcon />
          </ListItemIcon>
          <ListItemText
            primary="Simples Nacional"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontFamily: '"Roboto", "Arial", sans-serif'
            }}
          />
          {expandedMenus.simplesNacional ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={expandedMenus.simplesNacional} timeout="auto">
          <List component="div" disablePadding sx={{ bgcolor: '#fff' }}>
            <ListItemButton
              component={Link}
              to="/sub-limite-sn"
              selected={isActive('/sub-limite-sn')}
              sx={{
                pl: 6,
                py: 1.5,
                '&.Mui-selected': {
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  '& .MuiListItemIcon-root': {
                    color: '#fff'
                  },
                  '&:hover': {
                    backgroundColor: '#1565c0'
                  }
                },
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  transition: 'background-color 0.2s'
                }
              }}
            >
              <ListItemIcon sx={{
                minWidth: 40,
                color: isActive('/sub-limite-sn') ? '#fff' : '#6c757d'
              }}>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText
                primary="Sub Limite SN"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontFamily: '"Roboto", "Arial", sans-serif'
                }}
              />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default Sidebar;