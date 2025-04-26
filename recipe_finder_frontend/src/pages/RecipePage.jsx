// src/pages/RecipePage.jsx
import { useState, useEffect } from 'react';
import { Box, Title, Text, SimpleGrid, Button, Group, Tabs, TextInput, Loader, Alert } from '@mantine/core';
import { IconSearch, IconPlus, IconHeart, IconBookmark, IconChefHat, IconAlertCircle } from '@tabler/icons-react';
import RecipeCard from '../components/RecipeCard';
import Header from '../components/Header';
import { Link, useSearchParams } from 'react-router-dom';
import userService from '../services/user-service';

function RecipePage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'saved';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load recipes based on active tab
    const loadRecipes = async () => {
      setLoading(true);
      setError('');
      
      try {
        if (activeTab === 'saved') {
          const data = await userService.getUserBookmarks();
          setSavedRecipes(data);
        } else if (activeTab === 'favorites') {
          const data = await userService.getUserFavorites();
          setFavoriteRecipes(data);
        } else if (activeTab === 'my-recipes') {
          const data = await userService.getUserRecipes();
          setMyRecipes(data);
        }
      } catch (err) {
        console.error('Error loading recipes:', err);
        setError('Failed to load recipes. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadRecipes();
  }, [activeTab]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    // Update URL to reflect tab change
    const params = new URLSearchParams(searchParams);
    params.set('tab', newTab);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  
    // Validate search query
    if (query.length < 3) {
      setSearchError('Search query must be at least 3 characters.');
    } else {
      setSearchError('');
    }
  };
  
  // Filter recipes based on search query
  const filterRecipes = (recipes) => {
    if (!searchQuery || searchQuery.length < 3) return recipes; // Don't filter if invalid query
    
    return recipes.filter(recipe => 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <Box>
      <Header />
      <Box p="xl">
        <Group position="apart" mb="lg">
          <Title order={1}>Recipes</Title>
          <Button 
            leftSection={<IconPlus size={18} />} 
            color="orange" 
            component={Link} 
            to="/create-recipe"
          >
            Create Recipe
          </Button>
        </Group>

        <Tabs value={activeTab} onChange={handleTabChange} mb="xl">
          <Tabs.List>
            <Tabs.Tab value="saved" leftSection={<IconBookmark size={16} />}>
              Saved Recipes
            </Tabs.Tab>
            <Tabs.Tab value="favorites" leftSection={<IconHeart size={16} />}>
              Favorites
            </Tabs.Tab>
            <Tabs.Tab value="my-recipes" leftSection={<IconChefHat size={16} />}>
              My Recipes
            </Tabs.Tab>
          </Tabs.List>
        
          <TextInput
            placeholder="Search saved recipes"
            leftSection={<IconSearch size={16} />}
            mb="lg"
            value={searchQuery}
            onChange={handleSearchChange} // Use the handleSearchChange function here
            />
          {searchError && <Text color="red" size="sm">{searchError}</Text>} // Display error message

          <Tabs.Panel value="saved" pt="md">
            <TextInput
              placeholder="Search saved recipes"
              leftSection={<IconSearch size={16} />}
              mb="lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {error && (
              <Alert 
                icon={<IconAlertCircle size={16} />} 
                title="Error" 
                color="red" 
                mb="md"
              >
                {error}
              </Alert>
            )}
            
            {loading ? (
              <Box ta="center" py={50}>
                <Loader size="lg" />
              </Box>
            ) : savedRecipes.length > 0 ? (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                {filterRecipes(savedRecipes).map((recipe) => (
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
            ) : (
              <Box ta="center" py={50}>
                <IconBookmark size={48} color="gray" style={{ opacity: 0.5, marginBottom: 20 }} />
                <Title order={3} mb="sm">No saved recipes yet</Title>
                <Text c="dimmed" mb="xl">Browse and save recipes for quick access</Text>
                <Button leftSection={<IconPlus size={14} />} variant="outline" to="/search" component={Link}>
                  Browse Recipes
                </Button>
              </Box>
            )}
          </Tabs.Panel>
          
          <Tabs.Panel value="favorites" pt="md">
            <TextInput
              placeholder="Search favorite recipes"
              leftSection={<IconSearch size={16} />}
              mb="lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {error && (
              <Alert 
                icon={<IconAlertCircle size={16} />} 
                title="Error" 
                color="red" 
                mb="md"
              >
                {error}
              </Alert>
            )}
            
            {loading ? (
              <Box ta="center" py={50}>
                <Loader size="lg" />
              </Box>
            ) : favoriteRecipes.length > 0 ? (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                {filterRecipes(favoriteRecipes).map((recipe) => (
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
            ) : (
              <Box ta="center" py={50}>
                <IconHeart size={48} color="gray" style={{ opacity: 0.5, marginBottom: 20 }} />
                <Title order={3} mb="sm">No favorite recipes yet</Title>
                <Text c="dimmed" mb="xl">Save your favorite recipes here for quick access</Text>
                <Button leftSection={<IconPlus size={14} />} variant="outline" to="/search" component={Link}>
                  Browse Recipes
                </Button>
              </Box>
            )}
          </Tabs.Panel>
          
          <Tabs.Panel value="my-recipes" pt="md">
            <TextInput
              placeholder="Search my recipes"
              leftSection={<IconSearch size={16} />}
              mb="lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {error && (
              <Alert 
                icon={<IconAlertCircle size={16} />} 
                title="Error" 
                color="red" 
                mb="md"
              >
                {error}
              </Alert>
            )}
            
            {loading ? (
              <Box ta="center" py={50}>
                <Loader size="lg" />
              </Box>
            ) : myRecipes.length > 0 ? (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                {filterRecipes(myRecipes).map((recipe) => (
                  <RecipeCard 
                    key={recipe._id} 
                    id={recipe._id} 
                    image={recipe.mainImage} 
                    title={recipe.title} 
                    author="You" 
                    rating={recipe.rating} 
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Box ta="center" py={50}>
                <IconChefHat size={48} color="gray" style={{ opacity: 0.5, marginBottom: 20 }} />
                <Title order={3} mb="sm">You haven't created any recipes</Title>
                <Text c="dimmed" mb="xl">Share your cooking expertise with the community</Text>
                <Button leftSection={<IconPlus size={14} />} color="orange" to="/create-recipe" component={Link}>
                  Create Recipe
                </Button>
              </Box>
            )}
          </Tabs.Panel>
        </Tabs>
      </Box>
    </Box>
  );
}

export default RecipePage;