import { Button, styled } from '@mui/material';

interface CustomButtonProps {
  width?: string;
  height?: string;
  padding?: string;
}

export const StyledButton = styled(Button)<CustomButtonProps>`
  color: #fff;
  background-color: #444;
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '50px'};
  padding: ${(props) => props.padding || '10px 20px'};
  border-radius: 6px;
  text-transform: none;
  box-shadow: none;
  font-weight: 500;

  &:hover {
    background-color: #555;
  }

  &:disabled {
    background-color: #333;
    color: rgba(255, 255, 255, 0.5);
  }
`;
