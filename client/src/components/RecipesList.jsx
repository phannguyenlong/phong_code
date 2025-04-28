import { SimpleGrid, Text, Box } from '@mantine/core';
import RecipeCard from './RecipeCard';

function RecipesList() {
  const cucumberRecipes = [
    {
      id: 1,
      title: 'Cucumber + Wakame',
      image: 'https://img-global.cpcdn.com/recipes/036400bf6e807ce6/160x120cq50/photo.webp',
    },
    {
      id: 2,
      title: 'Korean style Cucumber',
      image: 'https://img-global.cpcdn.com/recipes/036400bf6e807ce6/160x120cq50/photo.webp',
    },
    {
      id: 3,
      title: 'Ranch Cucumber',
      image: 'https://img-global.cpcdn.com/recipes/036400bf6e807ce6/160x120cq50/photo.webp',
    },
    {
      id: 4,
      title: '24 Hour/Overnight',
      image: 'https://img-global.cpcdn.com/recipes/036400bf6e807ce6/160x120cq50/photo.webp',
    },
  ];

  return (
    <Box mt={30}>
      <Text fw={600} size="lg" mb={10}>See what's cooking! Exploring New Recipes</Text>
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 4 }} spacing="md">
        {cucumberRecipes.map((item) => (
          <RecipeCard key={item.id} image={item.image} title={item.title} />
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default RecipesList;
