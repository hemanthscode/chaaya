/**
 * Search Page
 * Search images by title, tags, description
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IoSearch, IoClose } from 'react-icons/io5';
import * as imageService from '@services/imageService';
import Container from '@components/layout/Container';
import ImageGrid from '@components/portfolio/ImageGrid';
import Input from '@components/common/Input';
import Button from '@components/common/Button';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, []);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setSearched(true);

      const response = await imageService.search({
        q: searchQuery,
        limit: 50,
      });

      setImages(response.images || []);
    } catch (error) {
      console.error('Search error:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
      performSearch(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    setImages([]);
    setSearched(false);
    setSearchParams({});
  };

  return (
    <div className="py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Search
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find images by title, tags, or description
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search for images..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                leftIcon={<IoSearch />}
                rightIcon={
                  query && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <IoClose size={20} />
                    </button>
                  )
                }
              />
            </div>
            <Button type="submit" variant="primary" size="lg">
              Search
            </Button>
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner w-12 h-12 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Searching...</p>
          </div>
        ) : searched ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                {images.length > 0 ? (
                  <>
                    Found <span className="font-semibold">{images.length}</span> result
                    {images.length !== 1 && 's'} for "{query}"
                  </>
                ) : (
                  <>No results found for "{query}"</>
                )}
              </p>
            </div>

            <ImageGrid images={images} />
          </>
        ) : (
          <div className="text-center py-16">
            <IoSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Start searching to find images
            </p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Search;
