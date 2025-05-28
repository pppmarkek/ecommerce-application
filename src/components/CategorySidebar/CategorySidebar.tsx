import React from 'react';
import { List, ListItemButton, ListItemText, IconButton, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import type { CategoryNode } from '@/types/category';

interface Props {
  tree: CategoryNode[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export const CategorySidebar: React.FC<Props> = ({ tree, selectedId, onSelect }) => {
  const [openIds, setOpenIds] = React.useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    const next = new Set(openIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setOpenIds(next);
  };

  const renderNode = (node: CategoryNode, level = 0) => (
    <React.Fragment key={node.id}>
      <ListItemButton sx={{ pl: 2 + level * 2 }}>
        <ListItemText
          primary={node.name['en-US']}
          onClick={() => onSelect(node.id)}
          primaryTypographyProps={{
            color: node.id === selectedId ? 'primary' : 'inherit',
          }}
        />
        {node.children.length > 0 && (
          <IconButton size="small" onClick={() => toggle(node.id)} edge="end">
            {openIds.has(node.id) ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </ListItemButton>
      {node.children.length > 0 && (
        <Collapse in={openIds.has(node.id)} timeout="auto" unmountOnExit>
          {node.children.map((c) => renderNode(c, level + 1))}
        </Collapse>
      )}
    </React.Fragment>
  );

  return <List>{tree.map((root) => renderNode(root))}</List>;
};
