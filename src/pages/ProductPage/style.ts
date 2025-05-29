import { styled, Grid } from '@mui/material';

export const Wrapper = styled(Grid)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px 0;
`;

export const ProductBox = styled(Grid)`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 20px;
`;

export const ProductBoxTopSide = styled(Grid)`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 20px;
`;
