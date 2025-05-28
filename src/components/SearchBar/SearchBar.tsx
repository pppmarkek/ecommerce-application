import { InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState } from 'react';
import { InputSearchBar } from './style';

interface Props {
  value: string;
  onSearch: (q: string) => void;
}

const SearchBar: React.FC<Props> = React.memo(function SearchBar({ value, onSearch }) {
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  const submit = () => onSearch(text.trim());

  return (
    <InputSearchBar
      placeholder="Search products"
      fullWidth
      variant="outlined"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && submit()}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={submit}>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
});

export default SearchBar;
