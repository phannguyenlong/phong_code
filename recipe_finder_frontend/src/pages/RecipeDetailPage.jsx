// src/pages/RecipeDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Box, Grid, Title, Text, Image, Group, Badge, Button, Tabs, List, ActionIcon, Divider, Paper, Avatar, Rating, Textarea, Loader, Alert, Center, Modal } from '@mantine/core';
import { IconClock, IconUsers, IconChefHat, IconStar, IconHeart, IconBookmark, IconPrinter, IconShare, IconMapPin, IconArrowLeft, IconAlertCircle, IconTrash, IconEdit } from '@tabler/icons-react';
import Header from '../components/Header';
import recipeService from '../services/recipe-service';
import commentService from '../services/comment-service';
import userService from '../services/user-service';
import { useAuth } from '../context/AuthContext';
import imageUtils from '../utils/image-utils';

function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('ingredients');
  const [recipe, setRecipe] = useState(null);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const [comments, setComments] = useState([]);

  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Fetch recipe data when component mounts or ID changes
    const fetchRecipeData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Fetch data in parallel
        const [recipeData, commentsData, relatedData] = await Promise.all([
          recipeService.getRecipeById(id),
          commentService.getRecipeComments(id),
          recipeService.getRelatedRecipes(id)
        ]);
        
        setRecipe(recipeData);
        setComments(commentsData);
        setRelatedRecipes(relatedData);
        
        if (isAuthenticated) {
          // Check if recipe is in user's favorites and bookmarks
          const [favoritesData, bookmarksData] = await Promise.all([
            userService.getUserFavorites(),
            userService.getUserBookmarks()
          ]);
          
          setIsFavorite(favoritesData.some(fav => fav._id === id));
          setIsBookmarked(bookmarksData.some(bookmark => bookmark._id === id));
        }
      } catch (err) {
        console.error('Error fetching recipe data:', err);
        setError('Failed to load recipe. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipeData();
  }, [id, isAuthenticated]);

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page in history
  };

  const handleToggleFavorite = async () => {
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
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleToggleBookmark = async () => {
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
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/recipe/${id}` } });
      return;
    }

    if (!newComment.trim() || newRating === 0) {
      return; // Don't submit empty comments or without rating
    }

    setCommentSubmitting(true);

    try {
      const createdComment = await commentService.createComment(id, newComment, newRating);

      // Add new comment to the list
      setComments([createdComment, ...comments]);

      // Reset form
      setNewComment('');
      setNewRating(0);

      // Update the recipe's rating (could also refetch the recipe)
      setRecipe({
        ...recipe,
        rating: createdComment.recipe.rating,
        reviewCount: (recipe.reviewCount || 0) + 1
      });
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeleteRecipe = async () => {
    setIsDeleting(true);
    try {
      await recipeService.deleteRecipe(id);
      navigate('/recipes');
    } catch (err) {
      console.error('Error deleting recipe:', err);
      setError('Failed to delete recipe. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Header />
        <Center py={100}>
          <Loader size="xl" />
        </Center>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Header />
        <Box p="xl">
          <Button
            leftSection={<IconArrowLeft size={16} />}
            variant="subtle"
            color="gray"
            onClick={handleGoBack}
            mb="xl"
          >
            Back
          </Button>

          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            mb="xl"
          >
            {error}
          </Alert>
        </Box>
      </Box>
    );
  }

  if (!recipe) {
    return (
      <Box>
        <Header />
        <Box p="xl">
          <Button
            leftSection={<IconArrowLeft size={16} />}
            variant="subtle"
            color="gray"
            onClick={handleGoBack}
            mb="xl"
          >
            Back
          </Button>

          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Recipe Not Found"
            color="red"
            mb="xl"
          >
            The recipe you're looking for doesn't exist or has been removed.
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Box p="md">
        {loading ? (
          <Center>
            <Loader size="xl" />
          </Center>
        ) : error ? (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
            {error}
          </Alert>
        ) : recipe ? (
          <>
            <Group position="apart" mb="md">
              <Button
                leftIcon={<IconArrowLeft size={14} />}
                variant="subtle"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
              {isAuthenticated && recipe.createdBy && recipe.createdBy._id === currentUser.id && (
                <Group>
                  <Button
                    leftIcon={<IconEdit size={14} />}
                    color="blue"
                    variant="outline"
                    onClick={() => navigate(`/recipe/${id}/edit`)}
                  >
                    Edit Recipe
                  </Button>
                  <Button
                    leftIcon={<IconTrash size={14} />}
                    color="red"
                    variant="outline"
                    onClick={() => setDeleteModalOpen(true)}
                  >
                    Delete Recipe
                  </Button>
                </Group>
              )}
            </Group>
            <Grid>
              {/* Left column - Recipe details */}
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Box>
                  <Title order={1} mb="xs">{recipe.title}</Title>

                  <Group mb="md">
                    <Group spacing={8}>
                      <Avatar src={recipe.createdBy?.avatar || null} radius="xl" size="sm">
                        {recipe.createdBy?.username?.charAt(0).toUpperCase() || '?'}
                      </Avatar>
                      <Text size="sm" fw={500}>By {recipe.createdBy?.username || 'Unknown'}</Text>
                    </Group>

                    {recipe.createdBy?.location && (
                      <Group spacing={5}>
                        <IconMapPin size={14} />
                        <Text size="sm" c="dimmed">{recipe.createdBy.location}</Text>
                      </Group>
                    )}

                    <Group spacing={5}>
                      <IconStar size={14} color="#FFD700" />
                      <Text size="sm">{recipe.rating || '0'}</Text>
                      <Text size="sm" c="dimmed">({recipe.reviewCount || 0} reviews)</Text>
                    </Group>
                  </Group>

                  <Image
                    src={imageUtils.getFullImageUrl(recipe.mainImage)}
                    height={400}
                    radius="md"
                    alt={recipe.title}
                    mb="lg"
                    fallbackSrc={imageUtils.fallbackImage}
                  />

                  <Group mb="lg" position="apart">
                    <Group>
                      <Box>
                        <Text size="sm" c="dimmed">Prep Time</Text>
                        <Group spacing={5}>
                          <IconClock size={16} />
                          <Text>{recipe.prepTime} mins</Text>
                        </Group>
                      </Box>

                      <Box>
                        <Text size="sm" c="dimmed">Cook Time</Text>
                        <Group spacing={5}>
                          <IconClock size={16} />
                          <Text>{recipe.cookTime} mins</Text>
                        </Group>
                      </Box>

                      <Box>
                        <Text size="sm" c="dimmed">Servings</Text>
                        <Group spacing={5}>
                          <IconUsers size={16} />
                          <Text>{recipe.servings}</Text>
                        </Group>
                      </Box>

                      <Box>
                        <Text size="sm" c="dimmed">Difficulty</Text>
                        <Group spacing={5}>
                          <IconChefHat size={16} />
                          <Text>{recipe.difficulty}</Text>
                        </Group>
                      </Box>
                    </Group>

                    <Group>
                      <ActionIcon
                        variant={isFavorite ? "filled" : "light"}
                        color="red"
                        size="lg"
                        onClick={handleToggleFavorite}
                      >
                        <IconHeart size={18} />
                      </ActionIcon>
                      <ActionIcon
                        variant={isBookmarked ? "filled" : "light"}
                        color="blue"
                        size="lg"
                        onClick={handleToggleBookmark}
                      >
                        <IconBookmark size={18} />
                      </ActionIcon>
                      <ActionIcon variant="light" size="lg">
                        <IconPrinter size={18} />
                      </ActionIcon>
                      <ActionIcon variant="light" size="lg">
                        <IconShare size={18} />
                      </ActionIcon>
                    </Group>
                  </Group>

                  <Text mb="lg">{recipe.description}</Text>

                  {recipe.tags && recipe.tags.length > 0 && (
                    <Group mb="md" spacing={8}>
                      {recipe.tags.map((tag, index) => (
                        <Badge key={index} color="orange" variant="light">
                          {tag}
                        </Badge>
                      ))}
                    </Group>
                  )}

                  <Divider my="lg" />

                  <Tabs value={activeTab} onTabChange={setActiveTab}>
                    <Tabs.List mb="md">
                      <Tabs.Tab value="ingredients">Ingredients</Tabs.Tab>
                      <Tabs.Tab value="instructions">Instructions</Tabs.Tab>
                      {recipe.nutrition && <Tabs.Tab value="nutrition">Nutrition Info</Tabs.Tab>}
                    </Tabs.List>

                    <Tabs.Panel value="ingredients">
                      <List spacing="sm" size="md">
                        {recipe.ingredients.map((ingredient, index) => (
                          <List.Item key={index}>
                            {ingredient.amount && ingredient.unit
                              ? `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`
                              : ingredient.amount
                                ? `${ingredient.amount} ${ingredient.name}`
                                : ingredient.name
                            }
                          </List.Item>
                        ))}
                      </List>
                    </Tabs.Panel>

                    <Tabs.Panel value="instructions">
                      <List spacing="sm" size="md" type="ordered">
                        {recipe.steps.map((step, index) => (
                          <List.Item key={index}>
                            {step.description}
                            {step.image && (
                              <Image
                                src={imageUtils.getFullImageUrl(step.image)}
                                height={200}
                                radius="md"
                                mt="sm"
                                fit="contain"
                                fallbackSrc={imageUtils.fallbackImage}
                              />
                            )}
                          </List.Item>
                        ))}
                      </List>
                    </Tabs.Panel>

                    {recipe.nutrition && (
                      <Tabs.Panel value="nutrition">
                        <Paper withBorder p="md" radius="md">
                          <Title order={4} mb="sm">Nutrition Facts (per serving)</Title>
                          <Grid>
                            {recipe.nutrition.calories && (
                              <Grid.Col span={6}>
                                <Text fw={500}>Calories:</Text>
                                <Text>{recipe.nutrition.calories}</Text>
                              </Grid.Col>
                            )}
                            {recipe.nutrition.fat && (
                              <Grid.Col span={6}>
                                <Text fw={500}>Fat:</Text>
                                <Text>{recipe.nutrition.fat}</Text>
                              </Grid.Col>
                            )}
                            {recipe.nutrition.carbs && (
                              <Grid.Col span={6}>
                                <Text fw={500}>Carbohydrates:</Text>
                                <Text>{recipe.nutrition.carbs}</Text>
                              </Grid.Col>
                            )}
                            {recipe.nutrition.protein && (
                              <Grid.Col span={6}>
                                <Text fw={500}>Protein:</Text>
                                <Text>{recipe.nutrition.protein}</Text>
                              </Grid.Col>
                            )}
                            {recipe.nutrition.sodium && (
                              <Grid.Col span={6}>
                                <Text fw={500}>Sodium:</Text>
                                <Text>{recipe.nutrition.sodium}</Text>
                              </Grid.Col>
                            )}
                            {recipe.nutrition.fiber && (
                              <Grid.Col span={6}>
                                <Text fw={500}>Fiber:</Text>
                                <Text>{recipe.nutrition.fiber}</Text>
                              </Grid.Col>
                            )}
                          </Grid>
                        </Paper>
                      </Tabs.Panel>
                    )}
                  </Tabs>

                  {recipe.notes && (
                    <>
                      <Divider my="lg" label="Notes" labelPosition="center" />
                      <Paper p="md" radius="md" withBorder mb="xl">
                        <Text>{recipe.notes}</Text>
                      </Paper>
                    </>
                  )}

                  <Divider my="xl" label="Reviews" labelPosition="center" />

                  <Box mb="xl">
                    <Title order={3} mb="md">Reviews ({comments.length})</Title>

                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <Paper key={comment._id} p="md" withBorder mb="md">
                          <Group position="apart" mb="xs">
                            <Group>
                              <Avatar
                                src={comment.user?.avatar || null}
                                radius="xl"
                              >
                                {comment.user?.username?.charAt(0).toUpperCase() || '?'}
                              </Avatar>
                              <div>
                                <Text fw={500}>{comment.user?.username || 'Anonymous'}</Text>
                                <Text size="xs" c="dimmed">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </Text>
                              </div>
                            </Group>
                            <Rating value={comment.rating} readOnly size="sm" />
                          </Group>
                          <Text>{comment.content}</Text>
                        </Paper>
                      ))
                    ) : (
                      <Text c="dimmed" ta="center" mb="lg">
                        Be the first to review this recipe!
                      </Text>
                    )}

                    <Paper p="md" withBorder>
                      <Title order={4} mb="sm">Leave a Review</Title>
                      <form onSubmit={handleSubmitComment}>
                        <Rating
                          mb="md"
                          value={newRating}
                          onChange={setNewRating}
                        />
                        <Textarea
                          placeholder="Share your experience with this recipe..."
                          minRows={3}
                          mb="md"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button
                          type="submit"
                          color="orange"
                          loading={commentSubmitting}
                          disabled={!newComment.trim() || newRating === 0}
                        >
                          Submit Review
                        </Button>
                      </form>
                    </Paper>
                  </Box>
                </Box>
              </Grid.Col>

              {/* Right column - Related recipes */}
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Paper p="md" withBorder>
                  <Title order={3} mb="md">You Might Also Like</Title>

                  {relatedRecipes.length > 0 ? (
                    relatedRecipes.map((relatedRecipe) => (
                      <Group key={relatedRecipe._id} mb="md" noWrap>
                        <Image
                          src={imageUtils.getFullImageUrl(relatedRecipe.mainImage)}
                          width={80}
                          height={60}
                          radius="md"
                          alt={relatedRecipe.title}
                          fallbackSrc={imageUtils.fallbackImage}
                        />
                        <Box>
                          <Text fw={500} component={Link} to={`/recipe/${relatedRecipe._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {relatedRecipe.title}
                          </Text>
                          <Rating value={relatedRecipe.rating || 0} readOnly size="xs" />
                        </Box>
                      </Group>
                    ))
                  ) : (
                    <Text c="dimmed" ta="center" mb="md">
                      No related recipes found
                    </Text>
                  )}

                  <Button variant="outline" color="orange" fullWidth mt="md" component={Link} to="/search">
                    Browse More Recipes
                  </Button>
                </Paper>
              </Grid.Col>
            </Grid>
          </>
        ) : null}
      </Box>

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Recipe"
        centered
      >
        <Text mb="lg">Are you sure you want to delete this recipe? This action cannot be undone.</Text>
        <Group position="right">
          <Button variant="subtle" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDeleteRecipe}
            loading={isDeleting}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}

export default RecipeDetailPage;