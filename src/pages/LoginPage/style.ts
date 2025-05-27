import { Grid, styled } from '@mui/material';

export const Wrapper = styled(Grid)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const LoginBox = styled(Grid)`
  justify-content: center;
  gap: 10px;
  width: 350px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 20px;
`;
