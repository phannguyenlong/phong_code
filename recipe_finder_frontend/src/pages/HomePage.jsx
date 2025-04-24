// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Box, Center, Image, Stack, Group, TextInput, Button, Alert, Loader, SimpleGrid, Text, Title } from '@mantine/core';
import { IconSearch, IconAlertCircle } from '@tabler/icons-react';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import { useNavigate } from 'react-router-dom';
import recipeService from '../services/recipe-service';
import searchService from '../services/search-service';

function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [popularSearches, setPopularSearches] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [recentRecipes, setRecentRecipes] = useState([]);
  
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
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError('Failed to load content. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Box>
      <Header />
      <Center mb={20}>
        <Stack align="center" spacing={0}>
          <Image
            src="/logo.png"
            alt="Recipe Finder"
            height={120}
            width={200}
            fit="contain"
          />
        </Stack>
      </Center>

      <Group className="search-container">
        <TextInput
          placeholder="Search by recipe or ingredients"
          leftSection={<IconSearch size={16} />}
          style={{ flex: 1 }}
          radius="md"
          size="md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSearch} color="orange" radius="md" size="md">
          Search
        </Button>
      </Group>

      <Box>
        <Image
          src="https://img-global.cpcdn.com/contest_banners/2e21d62bd73464b9/966x183cq70/banner.webp"
          alt="Featured Banner"
          className="banner"
          radius="md"
        />
      </Box>

      {error && (
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title="Error" 
          color="red" 
          mb="xl"
          mt="xl"
        >
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
                />
              ))}
            </SimpleGrid>
          </Box>
        </>
      )}
    </Box>
  );
}

export default HomePage;