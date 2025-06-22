import { styled, TextField } from '@mui/material';

export const InputSearchBar = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#818181',
    },
    '&:hover fieldset': {
      borderColor: '#818181',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#818181',
    },
  },
  input: {
    color: '#fff',
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: '#818181',
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottomColor: '#818181',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#818181',
  },
}));
