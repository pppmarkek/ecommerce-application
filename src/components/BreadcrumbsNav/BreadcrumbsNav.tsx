import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import type { CategoryNode } from '@/types/category';

interface Props {
  trail: CategoryNode[];
  onSelect: (id: string | null) => void;
}

export const BreadcrumbsNav: React.FC<Props> = ({ trail, onSelect }) => {
  if (trail.length === 0) return null;
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      <Link component="button" onClick={() => onSelect(null)}>
        All Products
      </Link>
      {trail.map((c, idx) => {
        const isLast = idx === trail.length - 1;
        return isLast ? (
          <Typography key={c.id} color="#fff">
            {c.name['en-US']}
          </Typography>
        ) : (
          <Link key={c.id} component="button" onClick={() => onSelect(c.id)}>
            {c.name['en-US']}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};
