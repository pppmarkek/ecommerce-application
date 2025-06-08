import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const Container = styled(Box)`
  max-width: 600px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Card = styled(Box)`
  padding: 24px;
  border-radius: 12px;
  border: solid 1px white;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Row = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Label = styled(Typography)`
  font-weight: 600;
  color: #fff;
`;

export const Value = styled(Typography)`
  color: #fff;
`;

export const AddressLine = styled(Typography)`
  margin: 4px 0;
  color: #fff;
`;
