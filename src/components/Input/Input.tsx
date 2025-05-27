import { StyledInput } from './style';
import { InputProps } from '@mui/material';

interface CustomInputProps extends InputProps {
  width?: string;
  height?: string;
  padding?: string;
}

export const Input = (props: CustomInputProps) => {
  return <StyledInput {...props} />;
};
