import { Input, styled } from '@mui/material';

interface CustomInputProps {
  width?: string;
  height?: string;
  padding?: string;
}

export const StyledInput = styled(Input)<CustomInputProps>`
  color: #fff;
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '40px'};
  padding: ${(props) => props.padding || '10px 0px'};

  input {
    color: #fff;

    &::placeholder {
      color: #fff;
      opacity: 0.7;
    }
  }

  &.MuiInput-underline:before {
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  }

  &.MuiInput-underline:after {
    border-bottom: 2px solid #fff;
  }

  &.MuiInput-underline:hover:before {
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  }
`;
