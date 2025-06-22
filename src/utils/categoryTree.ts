import type { Category } from '@/services/api';
import type { CategoryNode } from '@/types/category';

export function buildCategoryMapFromList(categories: Category[]): Record<string, CategoryNode> {
  const map: Record<string, CategoryNode> = {};
  categories.forEach((cat) => {
    map[cat.id] = {
      id: cat.id,
      name: cat.name,
      parentId: cat.parent?.id ?? null,
      children: [],
    };
  });
  Object.values(map).forEach((node) => {
    if (node.parentId && map[node.parentId]) {
      map[node.parentId].children.push(node);
    }
  });
  return map;
}

export function buildCategoryTree(map: Record<string, CategoryNode>): CategoryNode[] {
  return Object.values(map).filter((n) => n.parentId === null);
}

export function buildTrail(
  map: Record<string, CategoryNode>,
  selectedId: string | null,
): CategoryNode[] {
  if (!selectedId || !map[selectedId]) return [];
  const trail: CategoryNode[] = [];
  let cur: CategoryNode | undefined = map[selectedId];
  while (cur) {
    trail.unshift(cur);
    cur = cur.parentId ? map[cur.parentId] : undefined;
  }
  return trail;
}
