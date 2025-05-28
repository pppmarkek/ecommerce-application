import { useEffect, useState, useMemo, useCallback, lazy, Suspense, JSX } from 'react';
import { Grid, Typography, CircularProgress, Box } from '@mui/material';
import { getAllProducts, getAllCategories, Category } from '@/services/api';
import { Product, ProductVariant, LocalizedString } from '@/types/product';
import { PageLayout, Content, Sidebar, ProductGrid } from './style';
import { buildCategoryMapFromList, buildCategoryTree, buildTrail } from '@/utils/categoryTree';
import { Button } from '@/components/Button/Button';

const CategorySidebar = lazy(() => import('@/components/CategorySidebar/CategorySidebar'));
const FilterSidebar = lazy(() => import('@/components/FilterSidebar/FilterSidebar'));
const SearchBar = lazy(() => import('@/components/SearchBar/SearchBar'));
const SortSelect = lazy(() => import('@/components/SortSelect/SortSelect'));
const BreadcrumbsNav = lazy(() => import('@/components/BreadcrumbsNav/BreadcrumbsNav'));
const ProductContainer = lazy(() => import('@/components/ProductContainer/ProductContainer'));

function pickAttr(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  const v = value as Record<string, unknown>;
  if (typeof v.key === 'string') return v.key;
  if (typeof v.label === 'string') return v.label;
  if (typeof v['en-US'] === 'string') return v['en-US'];
  return '';
}

interface Projection {
  id: string;
  name: LocalizedString;
  description?: LocalizedString;
  masterVariant: ProductVariant;
  variants: ProductVariant[];
}

type Item = Product | Projection;

const isProduct = (p: Item): p is Product => (p as Product).masterData !== undefined;

const getVariant = (p: Item): ProductVariant =>
  isProduct(p) ? p.masterData.current.masterVariant : p.masterVariant;

const getName = (p: Item): string =>
  isProduct(p) ? p.masterData.current.name['en-US'] : p.name['en-US'];

const getDescription = (p: Item): string =>
  isProduct(p)
    ? (p.masterData.current.description?.['en-US'] ?? '')
    : (p.description?.['en-US'] ?? '');

export default function HomePage(): JSX.Element {
  const pageSize = 20;

  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<
    'relevance' | 'price asc' | 'price desc' | 'name.en asc' | 'name.en desc'
  >('relevance');
  const [filters, setFilters] = useState<{
    brand: string[];
    color: string[];
    size: string[];
  }>({ brand: [], color: [], size: [] });
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const categoryMap = useMemo(() => buildCategoryMapFromList(categories), [categories]);
  const categoryTree = useMemo(() => buildCategoryTree(categoryMap), [categoryMap]);
  const breadcrumbTrail = useMemo(
    () => buildTrail(categoryMap, selectedCategoryId),
    [categoryMap, selectedCategoryId],
  );

  useEffect(() => {
    getAllCategories()
      .then((cats: Category[]) => setCategories(cats))
      .catch(console.error);
  }, []);

  const fetchProducts = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getAllProducts({
        offset: pageIndex * pageSize,
        limit: pageSize,
        categoryId: selectedCategoryId ?? undefined,
        sort: sortOrder.startsWith('name.') && !searchQuery ? sortOrder : undefined,
      });
      setItems(response.results as Item[]);
      setTotal(response.total);
    } finally {
      setLoading(false);
    }
  }, [pageIndex, pageSize, selectedCategoryId, sortOrder, searchQuery]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const filterOptions = useMemo(() => {
    const B = new Set<string>();
    const C = new Set<string>();
    const S = new Set<string>();
    let min = Infinity;
    let max = 0;

    items.forEach((item) => {
      const v = getVariant(item);

      v.attributes?.forEach((attr) => {
        const val = pickAttr(attr.value).toLowerCase();
        if (attr.name === 'brand') B.add(val);
        if (attr.name === 'color') C.add(val);
        if (attr.name === 'size') S.add(val);
      });

      const cents = v.prices?.[0]?.value.centAmount ?? 0;
      min = Math.min(min, cents);
      max = Math.max(max, cents);
    });

    return {
      brand: Array.from(B).sort(),
      color: Array.from(C).sort(),
      size: Array.from(S).sort(),
      minPrice: min === Infinity ? 0 : min,
      maxPrice: max,
    };
  }, [items]);

  const processedItems = useMemo<Item[]>(() => {
    let result = [...items];

    if (filters.brand.length || filters.color.length || filters.size.length) {
      result = result.filter((item) => {
        const v = getVariant(item);
        const map: Record<string, string> = {};
        v.attributes?.forEach((attr) => {
          map[attr.name] = pickAttr(attr.value).toLowerCase();
        });
        if (filters.brand.length && !filters.brand.includes(map.brand ?? '')) return false;
        if (filters.color.length && !filters.color.includes(map.color ?? '')) return false;
        if (filters.size.length && !filters.size.includes(map.size ?? '')) return false;
        return true;
      });
    }

    if (priceRange[1] > 0) {
      result = result.filter((item) => {
        const cents = getVariant(item).prices?.[0]?.value.centAmount ?? 0;
        return cents >= priceRange[0] && cents <= priceRange[1];
      });
    }

    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      result = result.filter((item) => getName(item).toLowerCase().includes(term));
      result.sort((a, b) => getName(a).localeCompare(getName(b)));
    } else if (sortOrder.startsWith('price')) {
      result.sort((a, b) => {
        const pa = getVariant(a).prices?.[0]?.value.centAmount ?? 0;
        const pb = getVariant(b).prices?.[0]?.value.centAmount ?? 0;
        return sortOrder === 'price asc' ? pa - pb : pb - pa;
      });
    } else if (sortOrder.startsWith('name.')) {
      result.sort((a, b) =>
        sortOrder === 'name.en asc'
          ? getName(a).localeCompare(getName(b))
          : getName(b).localeCompare(getName(a)),
      );
    }

    return result;
  }, [items, filters, priceRange, searchQuery, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const goToPage = (next: number): void => {
    setPageIndex(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Grid container sx={{ p: 3 }}>
        <Typography variant="h3">All Products</Typography>
      </Grid>

      <PageLayout>
        <Sidebar>
          <Suspense fallback={<Box sx={{ p: 2 }}>Loading categories…</Box>}>
            <CategorySidebar
              tree={categoryTree}
              selectedId={selectedCategoryId}
              onSelect={(id: string | null): void => {
                setSelectedCategoryId(id);
                setPageIndex(0);
              }}
            />
          </Suspense>

          <Suspense fallback={<Box sx={{ p: 2 }}>Loading filters…</Box>}>
            <FilterSidebar
              options={filterOptions}
              selectedFilters={filters}
              priceRange={priceRange}
              onChange={(
                newFilters: { brand: string[]; color: string[]; size: string[] },
                newRange: [number, number],
              ): void => {
                setFilters(newFilters);
                setPriceRange(newRange);
                setPageIndex(0);
              }}
              onReset={(): void => {
                setFilters({ brand: [], color: [], size: [] });
                setPriceRange([0, 0]);
                setPageIndex(0);
              }}
            />
          </Suspense>
        </Sidebar>

        <Content>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Suspense fallback={<CircularProgress size={24} />}>
              <SearchBar
                value={searchQuery}
                onSearch={(q: string): void => {
                  setSearchQuery(q);
                  setPageIndex(0);
                }}
              />
            </Suspense>

            <Suspense fallback={<CircularProgress size={24} />}>
              <SortSelect
                value={sortOrder}
                onChange={(order: string): void => {
                  setSortOrder(
                    order as
                      | 'relevance'
                      | 'price asc'
                      | 'price desc'
                      | 'name.en asc'
                      | 'name.en desc',
                  );
                  setPageIndex(0);
                }}
              />
            </Suspense>
          </Box>

          <Suspense fallback={null}>
            <BreadcrumbsNav
              trail={breadcrumbTrail}
              onSelect={(id: string | null): void => {
                setSelectedCategoryId(id);
                setPageIndex(0);
              }}
            />
          </Suspense>

          {loading ? (
            <Grid container justifyContent="center" alignItems="center" minHeight="40vh">
              <CircularProgress />
            </Grid>
          ) : processedItems.length === 0 ? (
            <Typography variant="body1" mt={4}>
              No products found.
            </Typography>
          ) : (
            <Suspense fallback={<Typography>Loading products…</Typography>}>
              <ProductGrid>
                {processedItems.map((product: Item) => {
                  const variant = getVariant(product);
                  const imageUrl = variant.images?.[0]?.url
                    ? `${variant.images[0].url}?width=260&height=250&fit=crop&auto=compress`
                    : '';

                  return (
                    <ProductContainer
                      key={product.id}
                      id={product.id}
                      title={getName(product)}
                      img={imageUrl}
                      price={variant.prices?.[0]?.value.centAmount ?? 0}
                      currencyCode={variant.prices?.[0]?.value.currencyCode || 'USD'}
                      smallDescription={getDescription(product) || 'No description available'}
                    />
                  );
                })}
              </ProductGrid>
            </Suspense>
          )}

          <Grid container justifyContent="center" alignItems="center" gap={2} mt={4}>
            <Button
              onClick={() => goToPage(Math.max(0, pageIndex - 1))}
              disabled={pageIndex === 0}
              width="100px"
            >
              Previous
            </Button>
            <Typography variant="body1">
              Page {pageIndex + 1} of {totalPages}
            </Typography>
            <Button
              onClick={() => goToPage(Math.min(totalPages - 1, pageIndex + 1))}
              disabled={pageIndex + 1 >= totalPages}
              width="100px"
            >
              Next
            </Button>
          </Grid>
        </Content>
      </PageLayout>
    </>
  );
}
