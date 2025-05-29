import { styled, Grid } from '@mui/material';

export const Wrapper = styled(Grid)`
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;

export const ProductBox = styled(Grid)`
  width: 80%;
  gap: 20px;
`;

export const ProductBoxTopSide = styled(Grid)`
  gap: 20px;
`;

export const ImageContainer = styled('img')`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 10px;
`;

export const ProductDescription = styled(Grid)`
  gap: 10px;
`;
