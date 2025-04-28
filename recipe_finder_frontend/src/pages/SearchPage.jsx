// src/pages/SearchPage.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Box, Title, Text, Tabs, Group, TextInput, Button, SimpleGrid, Paper, Center, Divider, Alert, Loader, Select } from '@mantine/core';
import { IconSearch, IconStar, IconUser, IconClock, IconAlertCircle, IconPlus } from '@tabler/icons-react';
import Header from '../components/Header';
import searchService from '../services/search-service';
import categoryService from '../services/category-service';
import userService from '../services/user-service';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';

function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('q') || '';

  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [searchError, setSearchError] = useState('');
  const [activeTab, setActiveTab] = useState('latest');
  
  const [withIngredients, setWithIngredients] = useState('');
  const [withoutIngredients, setWithoutIngredients] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  
  const [searchResults, setSearchResults] = useState([]);
  const [categories] = useState([
    { value: 'Breakfast', label: 'Breakfast' },
    { value: 'Lunch', label: 'Lunch' },
    { value: 'Dinner', label: 'Dinner' },
    { value: 'Appetizer', label: 'Appetizer' },
    { value: 'Soup', label: 'Soup' },
    { value: 'Salad', label: 'Salad' },
    { value: 'Main Course', label: 'Main Course' },
    { value: 'Side Dish', label: 'Side Dish' },
    { value: 'Dessert', label: 'Dessert' },
    { value: 'Snack', label: 'Snack' },
    { value: 'Beverage', label: 'Beverage' }
  ]);
  const [cuisines] = useState([
    { value: 'Italian', label: 'Italian' },
    { value: 'Mexican', label: 'Mexican' },
    { value: 'Chinese', label: 'Chinese' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Indian', label: 'Indian' },
    { value: 'French', label: 'French' },
    { value: 'Thai', label: 'Thai' },
    { value: 'Mediterranean', label: 'Mediterranean' },
    { value: 'American', label: 'American' }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);

  // Perform search when query changes or on initial load
  useEffect(() => {
    if (queryParam) {
      performSearch();
    }
  }, [queryParam]); // eslint-disable-line react-hooks/exhaustive-deps

  const performSearch = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Prepare search parameters
      const searchParams = {
        q: searchQuery,
        withIngredients: withIngredients || undefined,
        withoutIngredients: withoutIngredients || undefined,
        category: selectedCategory || undefined,
        cuisine: selectedCuisine || undefined
      };
      
      const results = await searchService.searchRecipes(searchParams);
      setSearchResults(results);

      // If user is authenticated, fetch their favorites and bookmarks
      if (isAuthenticated) {
        const [favoritesData, bookmarksData] = await Promise.all([
          userService.getUserFavorites(),
          userService.getUserBookmarks()
        ]);
        setFavoriteRecipes(favoritesData);
        setBookmarkedRecipes(bookmarksData);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Update URL to reflect search
    const searchParams = new URLSearchParams();
    if (searchQuery) searchParams.set('q', searchQuery);
    if (withIngredients) searchParams.set('withIngredients', withIngredients);
    if (withoutIngredients) searchParams.set('withoutIngredients', withoutIngredients);
    if (selectedCategory) searchParams.set('category', selectedCategory);
    if (selectedCuisine) searchParams.set('cuisine', selectedCuisine);
    
    navigate(`/search?${searchParams.toString()}`);
    
    // Perform the search
    performSearch();
  };

  const handleClearFilters = () => {
    setWithIngredients('');
    setWithoutIngredients('');
    setSelectedCategory('');
    setSelectedCuisine('');
  };

  const isRecipeFavorite = (recipeId) => {
    return favoriteRecipes.some(recipe => recipe._id === recipeId);
  };

  const isRecipeBookmarked = (recipeId) => {
    return bookmarkedRecipes.some(recipe => recipe._id === recipeId);
  };

  return (
    <Box>
      <Header />
      <Box p="xl">
        <Box mb="xl">
          <form onSubmit={handleSearch}>
            <Group position="center" mb="md">
              <TextInput
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '50%' }}
                size="md"
                leftSection={<IconSearch size={20} />}
              />         
              <Button type="submit" color="orange" size="md">
                Search
              </Button>
            </Group>
          </form>

          <Box p="xl" bg="rgba(255, 248, 225, 0.5)" style={{ borderRadius: '8px' }}>
            <Title order={3} mb="lg">Filters</Title>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" mb="md">
              <Box>
                <Text fw={500} mb="xs">Show me recipes with:</Text>
                <TextInput
                  placeholder="Type ingredients (comma separated)..."
                  value={withIngredients}
                  onChange={(e) => setWithIngredients(e.target.value)}
                  mb="md"
                  leftSection={<IconSearch size={16} />}
                />
              </Box>

              <Box>
                <Text fw={500} mb="xs">Show me recipes without:</Text>
                <TextInput
                  placeholder="Type ingredients (comma separated)..."
                  value={withoutIngredients}
                  onChange={(e) => setWithoutIngredients(e.target.value)}
                  mb="md"
                  leftSection={<IconSearch size={16} />}
                />
              </Box>
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" mb="md">
              <Box>
                <Text fw={500} mb="xs">Category:</Text>
                <Select
                  placeholder="Select a category"
                  data={categories}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  searchable
                  clearable
                  nothingFound="No categories found"
                  maxDropdownHeight={280}
                />
              </Box>

              <Box>
                <Text fw={500} mb="xs">Cuisine:</Text>
                <Select
                  placeholder="Select a cuisine"
                  data={cuisines}
                  value={selectedCuisine}
                  onChange={setSelectedCuisine}
                  clearable
                />
              </Box>
            </SimpleGrid>

            <Group position="right" mt="md">
              <Button variant="subtle" onClick={handleClearFilters}>
                Clear Filters
              </Button>
              <Button color="orange" onClick={handleSearch}>
                Apply Filters
              </Button>
            </Group>
          </Box>

          <Tabs value={activeTab} onTabChange={setActiveTab} mb="xl" mt="xl">
            <Group position="center">
              <Tabs.List>
                <Tabs.Tab value="latest">Latest</Tabs.Tab>
                <Tabs.Tab value="popular">Popular</Tabs.Tab>
              </Tabs.List>
            </Group>
          </Tabs>

          <Title order={2} mb="lg">
            {searchQuery ? `Results for "${searchQuery}"` : 'Search Results'} 
            {searchResults.length > 0 ? ` (${searchResults.length})` : ' (0)'}
          </Title>

          {error && (
            <Alert 
              icon={<IconAlertCircle size={16} />} 
              title="Error" 
              color="red" 
              mb="xl"
            >
              {error}
            </Alert>
          )}

          {loading ? (
            <Center py={50}>
              <Loader size="lg" />
            </Center>
          ) : searchResults.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 3 }} spacing="lg">
              {searchResults.map((recipe) => (
                <RecipeCard 
                  key={recipe._id} 
                  id={recipe._id} 
                  image={recipe.mainImage} 
                  title={recipe.title} 
                  author={recipe.createdBy?.username || 'Unknown'} 
                  rating={recipe.rating}
                  isFavorite={isRecipeFavorite(recipe._id)}
                  isBookmarked={isRecipeBookmarked(recipe._id)}
                />
              ))}
            </SimpleGrid>
          ) : queryParam ? (
            <Box py={50} style={{ textAlign: 'center' }}>
              <Center mb={20}>
                <div style={{ width: '80px', height: '80px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: '#666' }}>
                    <path d="M12 6C8.5 6 8 9.5 8 11V14H16V11C16 9.5 15.5 6 12 6Z" />
                    <path d="M19 14C19 15.86 15.866 20 12 20C8.134 20 5 15.86 5 14C5 13.4696 5.21071 12.9609 5.58579 12.5858C5.96086 12.2107 6.46957 12 7 12H17C17.5304 12 18.0391 12.2107 18.4142 12.5858C18.7893 12.9609 19 13.4696 19 14Z" />
                  </svg>
                </div>
              </Center>
              <Title order={3} mb="sm">Can't find any matching recipes</Title>
              <Text c="dimmed" mb="xl">
                Try using different keywords or filters to find what you're looking for.
              </Text>
              <Button color="gray" variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </Box>
          ) : (
            <Box py={50} style={{ textAlign: 'center' }}>
              <Center mb={20}>
                <div style={{ width: '80px', height: '80px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: '#666' }}>
                    <path d="M12 6C8.5 6 8 9.5 8 11V14H16V11C16 9.5 15.5 6 12 6Z" />
                    <path d="M19 14C19 15.86 15.866 20 12 20C8.134 20 5 15.86 5 14C5 13.4696 5.21071 12.9609 5.58579 12.5858C5.96086 12.2107 6.46957 12 7 12H17C17.5304 12 18.0391 12.2107 18.4142 12.5858C18.7893 12.9609 19 13.4696 19 14Z" />
                  </svg>
                </div>
              </Center>
              <Title order={3} mb="sm">Enter a search term to find recipes</Title>
              <Text c="dimmed" mb="xl">
                Search by recipe name, ingredients, or cuisine type
              </Text>
              <Button color="orange" leftSection={<IconPlus size={16} />} component={Link} to="/create-recipe">
                Add Your Own Recipe
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default SearchPage;