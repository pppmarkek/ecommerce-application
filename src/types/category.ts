export interface CategoryNode {
  id: string;
  name: Record<string, string>;
  parentId: string | null;
  children: CategoryNode[];
}
