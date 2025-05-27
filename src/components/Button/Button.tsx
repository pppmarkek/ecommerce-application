import { StyledButton } from './style';
import { ButtonProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  width?: string;
  height?: string;
  padding?: string;
}

export const Button = (props: CustomButtonProps) => {
  return <StyledButton {...props} />;
};
