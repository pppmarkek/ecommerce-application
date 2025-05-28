import React, { useState, useEffect } from 'react';
import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Checkbox,
  FormControlLabel,
  Slider,
  Box,
  Typography,
  Stack,
  Grid,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Button } from '@/components/Button/Button';

interface Filters {
  brand: string[];
  color: string[];
  size: string[];
}
interface Options {
  brand: string[];
  color: string[];
  size: string[];
  minPrice: number;
  maxPrice: number;
}
interface Props {
  options: Options;
  selectedFilters: Filters;
  priceRange: [number, number];
  onChange: (f: Filters, p: [number, number]) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<Props> = ({
  options,
  selectedFilters,
  priceRange,
  onChange,
  onReset,
}) => {
  const [open, setOpen] = useState<Record<string, boolean>>({
    price: true,
    brand: true,
    color: true,
    size: true,
  });

  const [localF, setLocalF] = useState<Filters>(selectedFilters);
  const [localP, setLocalP] = useState<[number, number]>(priceRange);

  useEffect(() => setLocalF(selectedFilters), [selectedFilters]);
  useEffect(() => setLocalP(priceRange), [priceRange]);

  useEffect(() => {
    if (localP[0] === 0 && localP[1] === 0 && options.maxPrice > 0) {
      setLocalP([options.minPrice, options.maxPrice]);
    }
  }, [options, localP]);

  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  const handleCheck = (group: keyof Filters, value: string) =>
    setLocalF((f) => {
      const next = { ...f };
      next[group] = next[group].includes(value)
        ? next[group].filter((v) => v !== value)
        : [...next[group], value];
      return next;
    });

  const handlePrice = (_: Event, v: number | number[]) => setLocalP(v as [number, number]);

  const apply = () => onChange(localF, localP);
  const reset = () => {
    onReset();
    setLocalF({ brand: [], color: [], size: [] });
    setLocalP([options.minPrice, options.maxPrice]);
  };

  const cap = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

  const renderColorLabel = (raw: string) => {
    const [namePart, hexPart] = raw.split(':');
    const hex = hexPart ? `#${hexPart.replace('#', '')}` : '#000';
    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box
          sx={{
            width: 16,
            height: 16,
            bgcolor: hex,
            border: '1px solid #999',
          }}
        />
        <Typography variant="body2">{cap(namePart.trim())}</Typography>
      </Stack>
    );
  };

  const renderGroup = (title: string, key: keyof Filters, values: string[]) => (
    <>
      <ListItemButton onClick={() => toggle(key)}>
        <ListItemText primary={title} />
        {open[key] ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open[key]} timeout="auto" unmountOnExit>
        <Grid container flexDirection="column" sx={{ pl: 4 }}>
          {values.map((v) => (
            <FormControlLabel
              key={v}
              control={
                <Checkbox checked={localF[key].includes(v)} onChange={() => handleCheck(key, v)} />
              }
              label={key === 'color' ? renderColorLabel(v) : cap(v)}
            />
          ))}
        </Grid>
      </Collapse>
    </>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <List disablePadding>
        <ListItemButton onClick={() => toggle('price')}>
          <ListItemText primary="Price" />
          {open.price ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open.price} timeout="auto" unmountOnExit>
          <Box sx={{ px: 4, py: 1 }}>
            <Slider
              value={localP}
              onChange={handlePrice}
              valueLabelDisplay="auto"
              min={options.minPrice}
              max={options.maxPrice}
            />
            <Typography variant="caption">
              {localP[0]} – {localP[1]}
            </Typography>
          </Box>
        </Collapse>

        {renderGroup('Color', 'color', options.color)}
      </List>

      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button fullWidth onClick={apply}>
          Apply
        </Button>
        <Button fullWidth onClick={reset}>
          Reset
        </Button>
      </Box>
    </Box>
  );
};
