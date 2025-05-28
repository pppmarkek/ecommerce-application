import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Grid, Typography, CircularProgress, Box } from '@mui/material';
import { getAllProducts, getAllCategories, Category } from '@/services/api';
import { Product, ProductVariant, LocalizedString } from '@/types/product';
import { PageLayout, Content, Sidebar, ProductGrid } from './style';
import { ProductContainer } from '@/components/ProductContainer/ProductContainer';
import { CategorySidebar } from '@/components/CategorySidebar/CategorySidebar';
import { BreadcrumbsNav } from '@/components/BreadcrumbsNav/BreadcrumbsNav';
import { buildCategoryMapFromList, buildCategoryTree, buildTrail } from '@/utils/categoryTree';
import { FilterSidebar } from '@/components/FilterSidebar/FilterSidebar';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { SortSelect } from '@/components/SortSelect/SortSelect';
import { Button } from '@/components/Button/Button';

interface Projection {
  id: string;
  name: LocalizedString;
  description?: LocalizedString;
  masterVariant: ProductVariant;
  variants: ProductVariant[];
}
type Item = Product | Projection;
const isProduct = (p: Item): p is Product => (p as Product).masterData !== undefined;
const getVariant = (p: Item) =>
  isProduct(p) ? p.masterData.current.masterVariant : p.masterVariant;
const getName = (p: Item) => (isProduct(p) ? p.masterData.current.name['en-US'] : p.name['en-US']);
const getDescription = (p: Item) =>
  isProduct(p)
    ? (p.masterData.current.description?.['en-US'] ?? '')
    : (p.description?.['en-US'] ?? '');
const pickAttr = (v: unknown): string | undefined => {
  if (!v) return;
  if (typeof v === 'string') return v;
  const o = v as Record<string, string | undefined>;
  return o.key ?? o.label ?? o['en-US'] ?? o.en;
};
const score = (p: Item, term: string) => {
  const t = term.toLowerCase();
  const n = getName(p).toLowerCase();
  if (n === t) return 0;
  if (n.startsWith(t)) return 1;
  if (n.includes(t)) return 2;
  const d = getDescription(p).toLowerCase();
  return d.includes(t) ? 3 : 4;
};

export const HomePage = () => {
  const pageSize = 20;
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [catId, setCatId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<
    'relevance' | 'price asc' | 'price desc' | 'name.en asc' | 'name.en desc'
  >('relevance');
  const [filters, setFilters] = useState<{ brand: string[]; color: string[]; size: string[] }>({
    brand: [],
    color: [],
    size: [],
  });
  const [price, setPrice] = useState<[number, number]>([0, 0]);
  const [pageIdx, setPageIdx] = useState(0);

  const catMap = useMemo(() => buildCategoryMapFromList(cats), [cats]);
  const catTree = useMemo(() => buildCategoryTree(catMap), [catMap]);
  const trail = useMemo(() => buildTrail(catMap, catId), [catMap, catId]);

  useEffect(() => {
    getAllCategories().then(setCats).catch(console.error);
  }, []);

  const fetchPage = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllProducts({
        offset: pageIdx * pageSize,
        limit: pageSize,
        categoryId: catId ?? undefined,
        sort: sort.startsWith('name.') && !search ? sort : undefined,
      });
      setItems(res.results as unknown as Item[]);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [pageIdx, pageSize, catId, sort, search]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const filterOpts = useMemo(() => {
    const B = new Set<string>(),
      C = new Set<string>(),
      S = new Set<string>();
    let min = Infinity,
      max = 0;
    items.forEach((p) => {
      const v = getVariant(p);
      v.attributes?.forEach((a) => {
        const val = pickAttr(a.value)?.toLowerCase();
        if (!val) return;
        if (a.name === 'brand') B.add(val);
        if (a.name === 'color') C.add(val);
        if (a.name === 'size') S.add(val);
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

  useEffect(() => {
    if (price[1] === 0 && filterOpts.maxPrice > 0)
      setPrice([filterOpts.minPrice, filterOpts.maxPrice]);
  }, [filterOpts, price]);

  const processed = useMemo(() => {
    let list = [...items];
    if (filters.brand.length || filters.color.length || filters.size.length) {
      list = list.filter((p) => {
        const v = getVariant(p);
        const map: Record<string, string> = {};
        v.attributes?.forEach((a) => {
          const val = pickAttr(a.value);
          if (val) map[a.name] = val.toLowerCase();
        });
        if (filters.brand.length && !filters.brand.includes(map.brand ?? '')) return false;
        if (filters.color.length && !filters.color.includes(map.color ?? '')) return false;
        if (filters.size.length && !filters.size.includes(map.size ?? '')) return false;
        return true;
      });
    }
    if (price[1]) {
      list = list.filter((p) => {
        const cents = getVariant(p).prices?.[0]?.value.centAmount ?? 0;
        return cents >= price[0] && cents <= price[1];
      });
    }
    if (search) {
      list = list
        .filter((p) => score(p, search) < 4)
        .sort((a, b) => score(a, search) - score(b, search));
    } else {
      if (sort.startsWith('price')) {
        list.sort((a, b) => {
          const pa = getVariant(a).prices?.[0]?.value.centAmount ?? 0;
          const pb = getVariant(b).prices?.[0]?.value.centAmount ?? 0;
          return sort === 'price asc' ? pa - pb : pb - pa;
        });
      } else if (sort.startsWith('name.')) {
        list.sort((a, b) =>
          sort === 'name.en asc'
            ? getName(a).localeCompare(getName(b))
            : getName(b).localeCompare(getName(a)),
        );
      }
    }
    return list;
  }, [items, filters, price, search, sort]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handlePage = (next: number) => {
    setPageIdx(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Grid container sx={{ p: 3 }}>
        <Typography variant="h3">All Products</Typography>
      </Grid>
      <PageLayout>
        <Sidebar>
          <CategorySidebar
            tree={catTree}
            selectedId={catId}
            onSelect={(id) => {
              setCatId(id);
              setPageIdx(0);
            }}
          />
          <FilterSidebar
            options={filterOpts}
            selectedFilters={filters}
            priceRange={price}
            onChange={(f, p) => {
              setFilters({
                brand: f.brand.map((v) => v.toLowerCase()),
                color: f.color.map((v) => v.toLowerCase()),
                size: f.size.map((v) => v.toLowerCase()),
              });
              setPrice(p);
              setPageIdx(0);
            }}
            onReset={() => {
              setFilters({ brand: [], color: [], size: [] });
              setPrice([filterOpts.minPrice, filterOpts.maxPrice]);
              setPageIdx(0);
            }}
          />
        </Sidebar>
        <Content>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <SearchBar
              value={search}
              onSearch={(q) => {
                setSearch(q);
                setPageIdx(0);
              }}
            />
            <SortSelect
              value={sort}
              onChange={(v) => {
                setSort(
                  v as 'relevance' | 'price asc' | 'price desc' | 'name.en asc' | 'name.en desc',
                );
                setPageIdx(0);
              }}
            />
          </Box>
          <BreadcrumbsNav
            trail={trail}
            onSelect={(id) => {
              setCatId(id);
              setPageIdx(0);
            }}
          />
          {loading ? (
            <Grid container justifyContent="center" alignItems="center" minHeight="40vh">
              <CircularProgress />
            </Grid>
          ) : processed.length === 0 ? (
            <Typography variant="body1" mt={4}>
              No products found.
            </Typography>
          ) : (
            <>
              <ProductGrid>
                {processed.map((src) => {
                  const v = getVariant(src);
                  const img = v.images?.[0]?.url
                    ? `${v.images[0].url}?width=260&height=250&fit=crop`
                    : '';
                  return (
                    <ProductContainer
                      key={src.id}
                      id={src.id}
                      title={getName(src)}
                      img={img}
                      price={v.prices?.[0]?.value?.centAmount ?? 0}
                      currencyCode={v.prices?.[0]?.value?.currencyCode || 'USD'}
                      smallDescription={getDescription(src) || 'No description available'}
                    />
                  );
                })}
              </ProductGrid>
              <Grid container justifyContent="center" alignItems="center" gap={2} mt={4}>
                <Button
                  onClick={() => handlePage(Math.max(0, pageIdx - 1))}
                  disabled={pageIdx === 0}
                  width="100px"
                >
                  Previous
                </Button>
                <Typography variant="body1">
                  Page {pageIdx + 1} of {totalPages}
                </Typography>
                <Button
                  onClick={() => handlePage(Math.min(totalPages - 1, pageIdx + 1))}
                  disabled={pageIdx + 1 >= totalPages}
                  width="100px"
                >
                  Next
                </Button>
              </Grid>
            </>
          )}
        </Content>
      </PageLayout>
    </>
  );
};
