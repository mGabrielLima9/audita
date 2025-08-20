import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  ListItemSecondaryAction,
  Collapse,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Description as DescriptionIcon,
  Payment as PaymentIcon,
  Analytics as AnalyticsIcon,
  ChevronRight as ChevronRightIcon,
  Visibility as VisibilityIcon,
  ReceiptLong as ReceiptLongIcon,
  AccountBalance as AccountBalanceIcon,
  RadioButtonChecked as RadioButtonCheckedIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';

const drawerWidth = 280;

const Sidebar = () => {
  const [expandedMenus, setExpandedMenus] = useState({
    notasFiscais: false
  });

  const [expandedSubmenus, setExpandedSubmenus] = useState({
    declaracoes: false
  });

  const location = useLocation();

  const handleMenuToggle = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const handleSubmenuToggle = (submenu) => {
    setExpandedSubmenus(prev => ({
      ...prev,
      [submenu]: !prev[submenu]
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
          height: '100vh',
          bgcolor: '#FAFAFA',
          boxSizing: 'border-box',
          border: 'none',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          sx={{
            color: '#4CAF50',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          Auditor Digital
        </Typography>
        <VisibilityIcon sx={{ color: '#4CAF50' }} />
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List sx={{ px: 2 }}>
        <ListItemButton
          component={Link}
          to="/dashboard"
          selected={isActive('/dashboard')}
          sx={theme => ({
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
          })}
        >
          <ListItemIcon sx={{ minWidth: 40, color: isActive('/dashboard') ? '#fff' : '#424242' }}>
            <DashboardIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="Dashboard"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: isActive('/dashboard') ? 500 : 400
            }}
          />
        </ListItemButton>

        <Box sx={{ mt: 3, mb: 1 }}>
          <Typography
            variant="overline"
            sx={{
              color: '#757575',
              fontWeight: 500,
              fontSize: '0.75rem',
              letterSpacing: '0.1em'
            }}
          >
            VISÃO GERAL
          </Typography>
        </Box>

        <ListItemButton
          component={Link}
          to="/resumo-fiscal"
          selected={isActive('/resumo-fiscal')}
          sx={theme => ({
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
          })}
        >
          <ListItemIcon sx={{ minWidth: 40, color: isActive('/resumo-fiscal') ? '#fff' : '#424242' }}>
            <AssessmentIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="Resumo Fiscal"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: isActive('/resumo-fiscal') ? 500 : 400
            }}
          />
        </ListItemButton>

        <Box sx={{ mt: 3, mb: 1 }}>
          <Typography
            variant="overline"
            sx={{
              color: '#757575',
              fontWeight: 500,
              fontSize: '0.75rem',
              letterSpacing: '0.1em'
            }}
          >
            SIMPLES NACIONAL
          </Typography>
        </Box>

        {/* Sub Limite SN - item independente */}
        <ListItemButton
          component={Link}
          to="/sub-limite-sn"
          selected={isActive('/sub-limite-sn')}
          sx={{
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
          <ListItemIcon sx={{ minWidth: 40, color: isActive('/sub-limite-sn') ? '#fff' : '#424242' }}>
            <AccountBalanceIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="Sub Limite SN"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: isActive('/sub-limite-sn') ? 500 : 400
            }}
          />
        </ListItemButton>

        {/* Declarações - menu expansível */}
        <ListItemButton
          onClick={() => handleSubmenuToggle('declaracoes')}
          sx={{
            borderRadius: 1,
            mb: 0.5,
            '&:hover': {
              bgcolor: '#F5F5F5',
              transition: 'all 0.2s ease-in-out'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: '#424242' }}>
            <DescriptionIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="Declarações"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 400
            }}
          />
          {expandedSubmenus.declaracoes ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={expandedSubmenus.declaracoes} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
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
                {isActive('/contribuintes-omissos')
                  ? <RadioButtonCheckedIcon sx={{ fontSize: 16 }} />
                  : <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />}
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
                {isActive('/contribuintes-inadimplentes')
                  ? <RadioButtonCheckedIcon sx={{ fontSize: 16 }} />
                  : <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />}
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
                {isActive('/contribuintes-externos')
                  ? <RadioButtonCheckedIcon sx={{ fontSize: 16 }} />
                  : <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />}
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
                {isActive('/iss-outros-munic')
                  ? <RadioButtonCheckedIcon sx={{ fontSize: 16 }} />
                  : <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />}
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
                {isActive('/atividade-contabil')
                  ? <RadioButtonCheckedIcon sx={{ fontSize: 16 }} />
                  : <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />}
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
                {isActive('/regime-especial')
                  ? <RadioButtonCheckedIcon sx={{ fontSize: 16 }} />
                  : <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />}
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
                {isActive('/declaracoes-retificadas')
                  ? <RadioButtonCheckedIcon sx={{ fontSize: 16 }} />
                  : <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />}
              </ListItemIcon>
              <ListItemText
                primary="Declarações Retificadas"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive('/declaracoes-retificadas') ? 500 : 400
                }}
              />
            </ListItemButton>
          </List>
        </Collapse>

        <Box sx={{ mt: 3, mb: 1 }}>
          <Typography
            variant="overline"
            sx={{
              color: '#757575',
              fontWeight: 500,
              fontSize: '0.75rem',
              letterSpacing: '0.1em'
            }}
          >
            NOTAS FISCAIS
          </Typography>
        </Box>

        <ListItemButton
          onClick={() => handleMenuToggle('notasFiscais')}
          sx={{
            borderRadius: 1,
            mb: 0.5,
            '&:hover': {
              bgcolor: '#F5F5F5',
              transition: 'all 0.2s ease-in-out'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: '#424242' }}>
            <ReceiptLongIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="NFSe"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 400
            }}
          />
          <ListItemSecondaryAction>
            <ChevronRightIcon
              sx={{
                fontSize: 16,
                color: '#424242',
                transform: expandedMenus.notasFiscais ? 'rotate(90deg)' : 'none',
                transition: 'transform 0.2s ease-in-out'
              }}
            />
          </ListItemSecondaryAction>
        </ListItemButton>

        <Collapse in={expandedMenus.notasFiscais} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              component={Link}
              to="/nfse-emitidas"
              selected={isActive('/nfse-emitidas')}
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
              <ListItemIcon sx={{ minWidth: 40, color: isActive('/nfse-emitidas') ? '#fff' : '#424242' }}>
                <DescriptionIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Emitidas"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive('/nfse-emitidas') ? 500 : 400
                }}
              />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/nfse-prestador"
              selected={isActive('/nfse-prestador')}
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
              <ListItemIcon sx={{ minWidth: 40, color: isActive('/nfse-prestador') ? '#fff' : '#424242' }}>
                <DescriptionIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Prestador"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive('/nfse-prestador') ? 500 : 400
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