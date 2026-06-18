// pages/Products.jsx
// All products page with search, category filter, sorting, and pagination

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  const [localSearch, setLocalSearch] = useState(search);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getAll({ search, category, sort, page, limit: 12 });
      setProducts(data.products || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error('Products fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    productAPI.getCategories().then(({ data }) => setCategories(data.categories || []));
  }, []);

  const updateParam = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());
    if (value) params[key] = value;
    else delete params[key];
    params.page = '1';
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParam('search', localSearch);
  };

  const clearFilters = () => {
    setLocalSearch('');
    setSearchParams({});
  };

  const hasFilters = search || category || sort !== 'newest';

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '700', marginBottom: '8px' }}>
            {category
              ? <>{categories.find(c => c.slug === category)?.name || category}<span className="gradient-text"> Collection</span></>
              : search
              ? <>Search: <span className="gradient-text">"{search}"</span></>
              : <>All <span className="gradient-text">Products</span></>
            }
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            {loading ? '...' : `${pagination.total || 0} products found`}
          </p>
        </div>

        {/* Search + Filters */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)', padding: '20px',
          marginBottom: '32px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end',
        }}>
          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flex: '1 1 240px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <FiSearch size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="products-search-input"
                type="text"
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                placeholder="Search products..."
                className="form-input"
                style={{ paddingLeft: '42px' }}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm"><FiSearch size={15} /></button>
          </form>

          {/* Category Filter */}
          <div style={{ flex: '1 1 180px' }}>
            <label className="form-label" style={{ marginBottom: '6px', display: 'block' }}>Category</label>
            <select
              id="products-category-filter"
              value={category}
              onChange={e => updateParam('category', e.target.value)}
              className="form-select"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select>
          </div>

          {/* Sort */}
          <div style={{ flex: '1 1 180px' }}>
            <label className="form-label" style={{ marginBottom: '6px', display: 'block' }}>Sort By</label>
            <select
              id="products-sort-select"
              value={sort}
              onChange={e => updateParam('sort', e.target.value)}
              className="form-select"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Clear Filters */}
          {hasFilters && (
            <button onClick={clearFilters} className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-end' }}>
              <FiX size={15} /> Clear
            </button>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <Loader text="Loading products..." />
        ) : products.length === 0 ? (
          <div className="empty-state">
            <FiSearch size={56} />
            <h3>No products found</h3>
            <p>Try adjusting your search or filters.</p>
            <button onClick={clearFilters} className="btn btn-primary">Browse All Products</button>
          </div>
        ) : (
          <>
            <div className="grid-products animate-fade">
              {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', marginTop: '48px',
              }}>
                <button
                  onClick={() => updateParam('page', String(page - 1))}
                  disabled={page <= 1}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '8px' }}
                >
                  <FiChevronLeft size={18} />
                </button>

                {[...Array(pagination.totalPages)].map((_, i) => {
                  const p = i + 1;
                  const show = p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1;
                  if (!show) {
                    if (p === 2 || p === pagination.totalPages - 1) return <span key={p} style={{ color: 'var(--text-muted)' }}>...</span>;
                    return null;
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => updateParam('page', String(p))}
                      className={p === page ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
                      style={{ width: '38px', height: '38px', padding: 0 }}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  onClick={() => updateParam('page', String(page + 1))}
                  disabled={page >= pagination.totalPages}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '8px' }}
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
