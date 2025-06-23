import { Box, Paper, styled } from '@mui/material';

export const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
}));

export const StyledCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));
