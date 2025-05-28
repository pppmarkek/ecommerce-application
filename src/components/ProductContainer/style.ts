import { styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';

interface WrapperProps {
  hasDiscount?: boolean;
}

export const Wrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasDiscount',
})<WrapperProps>(({ hasDiscount }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '12px',
  padding: '16px',
  border: '1px solid',
  borderColor: hasDiscount ? '#d32f2f' : '#818181',
  borderRadius: '10px',
  width: '260px',
  height: '380px',
  cursor: 'pointer',
  transition: 'all 0.3s',
  '&:hover': {
    boxShadow: '0px 0px 15px 0px rgba(0,0,0,0.61)',
  },
}));

export const ImageContainer = styled('img')`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 10px;
`;

export const TextWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin: 0;
  padding: 0;
`;

export const Description = styled(Typography)`
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-align: start;
  overflow: hidden;
`;

export const Title = styled(Typography)`
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-align: start;
  overflow: hidden;
`;

export const OldPrice = styled(Typography)`
  text-decoration: line-through;
  color: #888;
`;

export const NewPrice = styled(Typography)`
  color: #d32f2f;
  font-weight: bold;
`;
