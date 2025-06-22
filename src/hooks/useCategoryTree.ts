import { useEffect, useState } from 'react';
import { Category, getAllCategories } from '@/services/api';

interface TreeNode extends Category {
  children: TreeNode[];
}

export function useCategoryTree() {
  const [tree, setTree] = useState<TreeNode[]>([]);

  useEffect(() => {
    getAllCategories().then((list) => {
      const map = new Map<string, TreeNode>();
      list.forEach((cat) => map.set(cat.id, { ...cat, children: [] }));
      const roots: TreeNode[] = [];
      map.forEach((node) => {
        if (node.parent && map.has(node.parent.id)) {
          map.get(node.parent.id)!.children.push(node);
        } else {
          roots.push(node);
        }
      });
      setTree(roots);
    });
  }, []);

  return tree;
}
