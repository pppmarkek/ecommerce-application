import { Box, styled } from '@mui/material';

export const HeaderContainer = styled('header')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 15px 60px;
  background: rgb(83, 83, 83);
`;

export const StyledImage = styled('img')`
  width: 90px;
  height: 60px;
  cursor: pointer;
`;

export const ButtonWrapper = styled('div')`
  display: flex;
  gap: 16px;
`;

export const CartCount = styled(Box)`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #444;
  height: 25px;
  width: 25px;
  border-radius: 50%;
`;
