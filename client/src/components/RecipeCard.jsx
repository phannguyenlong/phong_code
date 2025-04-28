// src/components/RecipeCard.jsx
import { useState } from 'react';
import { Text, Card, Image, Button, ActionIcon, Group, Divider } from '@mantine/core';
import { IconHeart, IconBookmark, IconStar } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services';
import imageUtils from '../utils/image-utils';

function RecipeCard({ id, image, title, author, rating, hideFooter = false, isFavorite: initialIsFavorite = false, isBookmarked: initialIsBookmarked = false }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  // Get the full image URL
  const imageUrl = imageUtils.getFullImageUrl(image);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/recipe/${id}` } });
      return;
    }
    
    try {
      if (isFavorite) {
        await userService.removeFromFavorites(id);
      } else {
        await userService.addToFavorites(id);
      }
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleToggleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/recipe/${id}` } });
      return;
    }
    
    try {
      if (isBookmarked) {
        await userService.removeFromBookmarks(id);
      } else {
        await userService.addToBookmarks(id);
      }
      
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  return (
    <Card key={id} shadow="sm" padding="lg" radius="md" withBorder className="recipe-card">
      <Card.Section>
        <Link to={`/recipe/${id}`}>
          <Image
            src={imageUrl}
            height={160}
            alt={title}
            fallbackSrc={imageUtils.fallbackImage}
          />
        </Link>
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text fw={500}>{title}</Text>
        {rating > 0 && (
          <Group spacing={5}>
            <IconStar size={16} color="#FFD700" />
            <Text size="sm">{rating}</Text>
          </Group>
        )}
      </Group>

      {author && (
        <Text size="sm" c="dimmed" mb="md">
          By {author}
        </Text>
      )}

      {!hideFooter && (
        <>
          <Divider my="xs" />

          <Group position="apart" mt="md">
            <Button 
              variant="light" 
              color="blue" 
              radius="md" 
              component={Link} 
              to={`/recipe/${id}`}
              size="sm"
            >
              View Recipe
            </Button>
            <Group spacing={8}>
              <ActionIcon 
                variant={isFavorite ? "filled" : "subtle"} 
                color="red"
                onClick={handleToggleFavorite}
              >
                <IconHeart size={18} />
              </ActionIcon>
              <ActionIcon 
                variant={isBookmarked ? "filled" : "subtle"} 
                color="blue"
                onClick={handleToggleBookmark}
              >
                <IconBookmark size={18} />
              </ActionIcon>
            </Group>
          </Group>
        </>
      )}
    </Card>
  );
}

export default RecipeCard;