import { styled, Grid, InputLabel, Input, Paper } from '@mui/material';
import Select, { SelectProps } from '@mui/material/Select';

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

export const CountryLabel = styled(InputLabel)`
  color: #fff;
  font-weight: 400;

  &.Mui-focused,
  &.Mui-error {
    color: #fff;
  }
`;

export const CountrySelect = styled(Select as React.ComponentType<SelectProps<string>>)`
  color: #fff;

  & .MuiSelect-select {
    align-items: flex-start;
    padding-top: 6px;
    padding-bottom: 4px;
    display: flex;
  }

  &::before {
    border-bottom: 1px solid #aaa;
  }
  &:hover:not(.Mui-disabled, .Mui-error)::before {
    border-bottom: 1px solid #fff;
  }
  &::after {
    border-bottom: 1px solid #fff;
  }
`;

export const CountryInput = styled(Input)`
  color: #fff;

  & .MuiSelect-select {
    align-items: flex-start;
    padding-top: 6px;
    padding-bottom: 4px;
    display: flex;
  }
  &::before {
    border-bottom: 1px solid #aaa;
  }
  &:hover:not(.Mui-disabled, .Mui-error)::before {
    border-bottom: 1px solid #fff;
  }
  &::after {
    border-bottom: 1px solid #fff;
  }
`;

export const CountryMenuPaper = styled(Paper)`
  background-color: #fff !important;

  & .MuiMenuItem-root {
    color: #000 !important;
  }
`;
