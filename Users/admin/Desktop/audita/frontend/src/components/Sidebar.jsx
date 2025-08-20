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

        <Collapse in={expandedMenus.simplesNacional} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              component={Link}
              to="/declaracoes-sn"
              selected={isActive('/declaracoes-sn')}
              sx={{
                pl: 6,
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: '#4CAF50',
                  color: '#fff',
                  '&:hover': { bgcolor: '#43A047' },
                  '& .MuiListItemIcon-root': { color: '#fff' }
                },
                '&:hover': {
                  bgcolor: '#F5F5F5',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isActive('/declaracoes-sn') ? '#fff' : '#424242' }}>
                <DescriptionIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Declarações"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive('/declaracoes-sn') ? 500 : 400
                }}
              />
            </ListItemButton>
          
            <ListItemButton
              component={Link}
              to="/contribuintes-omissos"
              selected={isActive('/contribuintes-omissos')}
              sx={{
                pl: 6,
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: '#4CAF50',
                  color: '#fff',
                  '&:hover': { bgcolor: '#43A047' },
                  '& .MuiListItemIcon-root': { color: '#fff' }
                },
                '&:hover': {
                  bgcolor: '#F5F5F5',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isActive('/contribuintes-omissos') ? '#fff' : '#424242' }}>
                <DescriptionIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Contribuintes Omissos"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive('/contribuintes-omissos') ? 500 : 400
                }}
              />
            </ListItemButton>
          
            <ListItemButton
              component={Link}
              to="/contribuintes-inadimplentes"
              selected={isActive('/contribuintes-inadimplentes')}
              sx={{
                pl: 6,
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: '#4CAF50',
                  color: '#fff',
                  '&:hover': { bgcolor: '#43A047' },
                  '& .MuiListItemIcon-root': { color: '#fff' }
                },
                '&:hover': {
                  bgcolor: '#F5F5F5',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isActive('/contribuintes-inadimplentes') ? '#fff' : '#424242' }}>
                <DescriptionIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Contribuintes Inadimplentes"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive('/contribuintes-inadimplentes') ? 500 : 400
                }}
              />
            </ListItemButton>
          
            <ListItemButton
              component={Link}
              to="/contribuintes-externos"
              selected={isActive('/contribuintes-externos')}
              sx={{
                pl: 6,
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: '#4CAF50',
                  color: '#fff',
                  '&:hover': { bgcolor: '#43A047' },
                  '& .MuiListItemIcon-root': { color: '#fff' }
                },
                '&:hover': {
                  bgcolor: '#F5F5F5',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isActive('/contribuintes-externos') ? '#fff' : '#424242' }}>
                <DescriptionIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Contribuintes Externos"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive('/contribuintes-externos') ? 500 : 400
                }}
              />
            </ListItemButton>
          
            <ListItemButton
              component={Link}
              to="/iss-outros-munic"
              selected={isActive('/iss-outros-munic')}
              sx={{
                pl: 6,
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: '#4CAF50',
                  color: '#fff',
                  '&:hover': { bgcolor: '#43A047' },
                  '& .MuiListItemIcon-root': { color: '#fff' }
                },
                '&:hover': {
                  bgcolor: '#F5F5F5',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isActive('/iss-outros-munic') ? '#fff' : '#424242' }}>
                <DescriptionIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="ISS Outras Munic"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive('/iss-outros-munic') ? 500 : 400
                }}
              />
            </ListItemButton>
          
            <ListItemButton
              component={Link}
              to="/atividade-contabil"
              selected={isActive('/atividade-contabil')}
              sx={{
                pl: 6,
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: '#4CAF50',
                  color: '#fff',
                  '&:hover': { bgcolor: '#43A047' },
                  '& .MuiListItemIcon-root': { color: '#fff' }
                },
                '&:hover': {
                  bgcolor: '#F5F5F5',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isActive('/atividade-contabil') ? '#fff' : '#424242' }}>
                <DescriptionIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Atividade Contábil"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive('/atividade-contabil') ? 500 : 400
                }}
              />
            </ListItemButton>
          
            <ListItemButton
              component={Link}
              to="/regime-especial"
              selected={isActive('/regime-especial')}
              sx={{
                pl: 6,
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: '#4CAF50',
                  color: '#fff',
                  '&:hover': { bgcolor: '#43A047' },
                  '& .MuiListItemIcon-root': { color: '#fff' }
                },
                '&:hover': {
                  bgcolor: '#F5F5F5',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isActive('/regime-especial') ? '#fff' : '#424242' }}>
                <DescriptionIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Regime Especial"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive('/regime-especial') ? 500 : 400
                }}
              />
            </ListItemButton>
          
            <ListItemButton
              component={Link}
              to="/declaracoes-retificadas"
              selected={isActive('/declaracoes-retificadas')}
              sx={{
                pl: 6,
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: '#4CAF50',
                  color: '#fff',
                  '&:hover': { bgcolor: '#43A047' },
                  '& .MuiListItemIcon-root': { color: '#fff' }
                },
                '&:hover': {
                  bgcolor: '#F5F5F5',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isActive('/declaracoes-retificadas') ? '#fff' : '#424242' }}>
                <DescriptionIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Declarações Retificadas"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive('/declaracoes-retificadas') ? 500 : 400
                }}
              />
            </ListItemButton>
          
            <ListItemButton
              component={Link}
              to="/parcelamentos-sn"
              selected={isActive('/parcelamentos-sn')}
              sx={{
                pl: 6,
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: '#4CAF50',
                  color: '#fff',
                  '&:hover': { bgcolor: '#43A047' },
                  '& .MuiListItemIcon-root': { color: '#fff' }
                },
                '&:hover': {
                  bgcolor: '#F5F5F5',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isActive('/parcelamentos-sn') ? '#fff' : '#424242' }}>
                <PaymentIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Parcelamentos"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive('/parcelamentos-sn') ? 500 : 400
                }}
              />
            </ListItemButton>
          
            <ListItemButton
              component={Link}
              to="/analise-dados-sn"
              selected={isActive('/analise-dados-sn')}
              sx={{
                pl: 6,
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: '#4CAF50',
                  color: '#fff',
                  '&:hover': { bgcolor: '#43A047' },
                  '& .MuiListItemIcon-root': { color: '#fff' }
                },
                '&:hover': {
                  bgcolor: '#F5F5F5',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isActive('/analise-dados-sn') ? '#fff' : '#424242' }}>
                <AnalyticsIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Análise de Dados"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive('/analise-dados-sn') ? 500 : 400
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