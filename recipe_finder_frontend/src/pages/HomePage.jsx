// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Box, Center, Image, Stack, Group, TextInput, Button, Alert, Loader, SimpleGrid, Text, Title } from '@mantine/core';
import { IconSearch, IconAlertCircle } from '@tabler/icons-react';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import { useNavigate } from 'react-router-dom';
import recipeService from '../services/recipe-service';
import searchService from '../services/search-service';
import userService from '../services/user-service';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [popularSearches, setPopularSearches] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch data when component mounts
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Fetch data in parallel
        const [searchesData, popularData, recentData] = await Promise.all([
          searchService.getPopularSearches(),
          recipeService.getPopularRecipes(),
          recipeService.getRecentRecipes()
        ]);
        
        setPopularSearches(searchesData);
        setPopularRecipes(popularData);
        setRecentRecipes(recentData);

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
        console.error('Error fetching homepage data:', err);
        setError('Failed to load content. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
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
        {/* Hero section with search */}
        <Stack align="center" spacing="xl" py={50}>
          <Title order={1} ta="center">Find & Share Amazing Recipes</Title>
          <Text size="lg" c="dimmed" maw={600} ta="center">
            Discover delicious recipes from around the world or share your own culinary creations
          </Text>
          
          <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: 600 }}>
            <TextInput
              size="lg"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftSection={<IconSearch size={20} />}
            />
          </form>
        </Stack>

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="xl">
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Center py={50}>
            <Loader size="lg" />
          </Center>
        ) : (
          <>
            {/* Popular Searches Section */}
            <Box mt={20}>
              <Group justify="space-between" mb={10}>
                <Text fw={600} size="lg">Today's popular searches</Text>
              </Group>
              <SimpleGrid cols={{ base: 1, xs: 2, sm: 4 }} spacing="md">
                {popularSearches.map((item) => (
                  <Box 
                    key={item.id} 
                    onClick={() => navigate(`/search?q=${encodeURIComponent(item.title)}`)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-5px)' }
                    }}
                  >
                    <RecipeCard 
                      id={item.id} 
                      image={item.imageUrl} 
                      title={item.title} 
                      author="" 
                      rating={0} 
                      hideFooter 
                    />
                  </Box>
                ))}
              </SimpleGrid>
            </Box>

            {/* Popular Recipes Section */}
            <Box mt={30}>
              <Title order={4} mb={15}>Popular Recipes</Title>
              <SimpleGrid cols={{ base: 1, xs: 2, sm: 4 }} spacing="md">
                {popularRecipes.map((recipe) => (
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
            </Box>

            {/* Recent Recipes Section */}
            <Box mt={30}>
              <Title order={4} mb={15}>Recently Added</Title>
              <SimpleGrid cols={{ base: 1, xs: 2, sm: 4 }} spacing="md">
                {recentRecipes.map((recipe) => (
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
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default HomePage;