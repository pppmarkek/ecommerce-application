import React from 'react';
import { StyledFormControl, StyledInputLabel, StyledSelect, StyledMenuItem } from './style';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const OPTIONS = [
  { v: 'relevance', label: 'Best match' },
  { v: 'price asc', label: 'Price: Low → High' },
  { v: 'price desc', label: 'Price: High → Low' },
  { v: 'name.en asc', label: 'Name: A → Z' },
  { v: 'name.en desc', label: 'Name: Z → A' },
] as const;

const SortSelect: React.FC<Props> = React.memo(function SortSelect({ value, onChange }) {
  return (
    <StyledFormControl variant="outlined">
      <StyledInputLabel id="sort-label">Sort By</StyledInputLabel>
      <StyledSelect
        labelId="sort-label"
        value={value}
        label="Sort By"
        onChange={(e) => onChange(e.target.value as string)}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: '#3f3f3f',
              color: '#fff',
              border: '1px solid #818181',
              boxShadow: 'none',
            },
          },
          MenuListProps: {
            sx: {
              padding: 0,
            },
          },
        }}
      >
        {OPTIONS.map((o) => (
          <StyledMenuItem key={o.v} value={o.v}>
            {o.label}
          </StyledMenuItem>
        ))}
      </StyledSelect>
    </StyledFormControl>
  );
});

export default SortSelect;
