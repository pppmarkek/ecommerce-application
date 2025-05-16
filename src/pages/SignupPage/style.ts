import { Grid, styled } from '@mui/material';

export const Wrapper = styled(Grid)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px 0;
`;

export const RegistrationBox = styled(Grid)`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 20px;
`;
export const RegistrationBoxField = styled(Grid)`
  justify-content: center;
  gap: 20px;
  border-radius: 8px;
  padding: 20px;
`;

export const RegistrationButton = styled(Grid)`
  justify-content: center;
  gap: 5px;
  padding: 20px;
  width: 100%;
`;

export const LineInputBox = styled(Grid)`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const SmallInputBox = styled(Grid)`
  width: 45%;
  align-items: flex-start;
  flex-direction: column;
`;
