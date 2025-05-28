import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectProps } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export const StyledFormControl = styled(FormControl)({
  width: '100%',
});

export const StyledInputLabel = styled(InputLabel)({
  color: '#fff',
  '&.Mui-focused': {
    color: '#fff',
  },
});

export const StyledSelect = styled(Select)<SelectProps>({
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#818181',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#818181',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#818181',
  },
  '& .MuiSelect-select': {
    color: '#fff',
  },
});

export const StyledMenuItem = styled(MenuItem)({
  backgroundColor: '#3f3f3f',
  color: '#fff',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: '#505050',
  },
  '&.Mui-selected': {
    backgroundColor: '#3f3f3f',
  },
  '&.Mui-selected:hover': {
    backgroundColor: '#505050',
  },
});
