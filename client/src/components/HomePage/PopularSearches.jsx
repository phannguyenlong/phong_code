import { SimpleGrid, Text, Box, Group } from '@mantine/core';
import RecipeCard from '../RecipeCard';

function PopularSearches() {
  const popularSearches = [
    {
      id: 1,
      title: 'cucumber',
      image: 'https://img-global.cpcdn.com/recipes/036400bf6e807ce6/160x120cq50/photo.webp',
      author: 'CookingMaster',
      rating: 4.8,
    },
    {
      id: 2,
      title: 'chicken thighs',
      image: 'https://img-global.cpcdn.com/recipes/953f1d23c28a5dea/160x120cq50/photo.webp',
      author: 'CookingMaster',
      rating: 4.8,
    },
    {
      id: 3,
      title: 'ramen',
      image: 'https://img-global.cpcdn.com/recipes/812e3b5063299b1d/160x120cq50/photo.webp',
      author: 'CookingMaster',
      rating: 4.8,
    },
    {
      id: 4,
      title: 'prawn',
      image: 'https://img-global.cpcdn.com/recipes/0fe8ee571c80fd2b/160x120cq50/photo.webp',
      author: 'CookingMaster',
      rating: 4.8,
    },
  ];

  return (
    <Box mt={20}>
      <Group justify="space-between" mb={10}>
        <Text fw={600} size="lg">Today's popular searches</Text>
      </Group>
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 4 }} spacing="md">
        {popularSearches.map((item) => (
          <RecipeCard key={item.id} id={item.id} image={item.image} title={item.title} author={item.author} rating={item.rating} />
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default PopularSearches;