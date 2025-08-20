import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Collapse,
  Grid,
  Slider,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  AttachMoney as MoneyIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { getSubLimite } from '../services/api';

const SubLimiteSN = () => {
  const [competencia, setCompetencia] = useState('202508');
  const [status, setStatus] = useState('Todos');
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  
  // Novos filtros avançados
  const [filtrosAvancados, setFiltrosAvancados] = useState(false);
  const [periodoInicio, setPeriodoInicio] = useState('01/2024');
  const [periodoFim, setPeriodoFim] = useState('12/2024');
  const [valorExtrapolado, setValorExtrapolado] = useState([0, 100]);
  const [cnpjFiltro, setCnpjFiltro] = useState('');
  const [razaoSocialFiltro, setRazaoSocialFiltro] = useState('');

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return '-';
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR');
  };

  const getStatusChip = (statusValue) => {
    switch (statusValue) {
      case 'Extrapolou o limite':
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#1976d2', 
              fontWeight: 'bold',
              fontSize: '0.75rem'
            }}
          >
            EXTRAPOLOU O LIMITE
          </Typography>
        );
      case 'Ultrapassando Sublimite':
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#ed6c02', 
              fontWeight: 'bold',
              fontSize: '0.75rem'
            }}
          >
            ULTRAPASSANDO SUBLIMITE
          </Typography>
        );
      case 'Até 20% do Sublimite':
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#2e7d32', 
              fontSize: '0.75rem'
            }}
          >
            ATÉ 20%
          </Typography>
        );
      default:
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#757575',
              fontSize: '0.75rem'
            }}
          >
            SEM RISCO
          </Typography>
        );
    }
  };

  const toggleRowExpansion = (index) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const pesquisar = async () => {
    setLoading(true);
    try {
      const filtros = status !== 'Todos' ? { status } : {};
      const resultado = await getSubLimite(competencia, filtros);
      setDados(resultado);
      setExpandedRows(new Set());
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const limparPesquisa = () => {
    setCompetencia('202508');
    setStatus('Todos');
    setCnpjFiltro('');
    setRazaoSocialFiltro('');
    setValorExtrapolado([0, 100]);
    setPeriodoInicio('01/2024');
    setPeriodoFim('12/2024');
    setDados(null);
    setExpandedRows(new Set());
  };

  const fecharPesquisa = () => {
    window.history.back();
  };

  const handleCnpjClick = (cnpj) => {
    console.log('CNPJ clicado:', cnpj);
  };

  const handleAcaoEmpresa = (cnpj) => {
    console.log('Ação para empresa:', cnpj);
  };

  // Filtrar dados localmente com base nos filtros avançados
  const dadosFiltrados = dados ? {
    ...dados,
    itens: dados.itens.filter(item => {
      const matchCnpj = !cnpjFiltro || item.cnpj.includes(cnpjFiltro);
      const matchRazao = !razaoSocialFiltro || 
        (item.razao_social && item.razao_social.toLowerCase().includes(razaoSocialFiltro.toLowerCase()));
      const matchValor = item.percentual_extrapolado >= valorExtrapolado[0] && 
        item.percentual_extrapolado <= valorExtrapolado[1];
      
      return matchCnpj && matchRazao && matchValor;
    })
  } : null;

  useEffect(() => {
    pesquisar();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Sub Limite SN
      </Typography>

      {/* Filtros Básicos */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={2}>
            <TextField
              label="Competência (AAAAMM)"
              value={competencia}
              onChange={(e) => setCompetencia(e.target.value)}
              size="small"
              fullWidth
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl size="small" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="Todos">Todos</MenuItem>
                <MenuItem value="Extrapolou o limite">Extrapolou o limite</MenuItem>
                <MenuItem value="Ultrapassando Sublimite">Ultrapassando Sublimite</MenuItem>
                <MenuItem value="Até 20% do Sublimite">Até 20% do Sublimite</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <Button 
              variant="contained" 
              onClick={pesquisar}
              disabled={loading}
              fullWidth
              sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#45a049' } }}
            >
              PESQUISAR
            </Button>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button 
              variant="outlined" 
              onClick={limparPesquisa}
              fullWidth
            >
              LIMPAR PESQUISA
            </Button>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button 
              variant="outlined" 
              onClick={fecharPesquisa}
              fullWidth
              sx={{ color: '#f44336', borderColor: '#f44336' }}
            >
              FECHAR PESQUISA
            </Button>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={filtrosAvancados}
                  onChange={(e) => setFiltrosAvancados(e.target.checked)}
                  color="primary"
                />
              }
              label="Pesquisa Avançada"
            />
          </Grid>
        </Grid>

        {/* Filtros Avançados */}
        <Collapse in={filtrosAvancados}>
          <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              <FilterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Pesquisa Avançada
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Período de Competência"
                  value={periodoInicio}
                  onChange={(e) => setPeriodoInicio(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="MM/AAAA"
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <TextField
                  label="até"
                  value={periodoFim}
                  onChange={(e) => setPeriodoFim(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="MM/AAAA"
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <TextField
                  label="CNPJ"
                  value={cnpjFiltro}
                  onChange={(e) => setCnpjFiltro(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="Digite parte do CNPJ"
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <TextField
                  label="Razão Social"
                  value={razaoSocialFiltro}
                  onChange={(e) => setRazaoSocialFiltro(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="Digite parte da razão social"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>% Vr Extrapolado</Typography>
                <Slider
                  value={valorExtrapolado}
                  onChange={(e, newValue) => setValorExtrapolado(newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 20, label: '20%' },
                    { value: 50, label: '50%' },
                    { value: 100, label: '100%' }
                  ]}
                />
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </Paper>

      {/* Resumo */}
      {dadosFiltrados && (
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Competência:</strong> {dadosFiltrados.competencia} | 
          <strong> Sublimite:</strong> {formatarMoeda(dadosFiltrados.sublimite)} | 
          <strong> Limite Simples:</strong> {formatarMoeda(dadosFiltrados.limite_simples)} | 
          <strong> Total:</strong> {dadosFiltrados.itens.length}
        </Typography>
      )}

      {/* Tabela */}
      {dadosFiltrados && dadosFiltrados.itens.length > 0 && (
        <TableContainer 
          component={Paper} 
          sx={{ 
            mt: 2,
            border: '1px solid #e0e0e0',
            '& .MuiTableCell-root': {
              border: '1px solid #e0e0e0',
              fontSize: '0.875rem'
            }
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#000', width: '50px' }}></TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Competência</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>CNPJ Prestador</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Início Atividade</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Entrada SN</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Rba</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>% Vr Extrapolado</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dadosFiltrados.itens.map((item, index) => (
                <React.Fragment key={index}>
                  <TableRow 
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa',
                      '&:hover': {
                        backgroundColor: '#f0f0f0'
                      }
                    }}
                  >
                    <TableCell>
                      <IconButton 
                        size="small" 
                        onClick={() => toggleRowExpansion(index)}
                        sx={{ color: '#1976d2' }}
                      >
                        {expandedRows.has(index) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{dadosFiltrados.competencia}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#1976d2',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          '&:hover': {
                            color: '#1565c0'
                          }
                        }}
                        onClick={() => handleCnpjClick(item.cnpj)}
                      >
                        {item.cnpj}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatarData(item.inicio_atividade)}</TableCell>
                    <TableCell>{formatarData(item.entrada_sn) || '-'}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatarMoeda(item.rbt12)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {item.percentual_extrapolado.toFixed(2)}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(item.status)}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Visualizar detalhes">
                        <IconButton 
                          onClick={() => handleAcaoEmpresa(item.cnpj)}
                          sx={{ 
                            color: '#2e7d32',
                            '&:hover': {
                              backgroundColor: '#e8f5e8'
                            }
                          }}
                          size="small"
                        >
                          <SearchIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                  
                  {/* Linha Expansível com Razão Social */}
                  <TableRow>
                    <TableCell 
                      colSpan={9} 
                      sx={{ 
                        p: 0, 
                        border: 'none',
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa'
                      }}
                    >
                      <Collapse in={expandedRows.has(index)} timeout="auto" unmountOnExit>
                        <Box 
                          sx={{ 
                            p: 2, 
                            backgroundColor: '#f9f9f9',
                            borderTop: '1px solid #e0e0e0',
                            borderBottom: '1px solid #e0e0e0'
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Razão Social:
                          </Typography>
                          <Typography variant="body2">
                            {item.razao_social || 'Não informado'}
                          </Typography>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Mensagem quando não há dados */}
      {dadosFiltrados && dadosFiltrados.itens.length === 0 && (
        <Paper sx={{ p: 3, mt: 2, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Nenhuma empresa encontrada para os filtros selecionados.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default SubLimiteSN;