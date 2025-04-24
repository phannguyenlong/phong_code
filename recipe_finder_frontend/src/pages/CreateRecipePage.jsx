// src/pages/CreateRecipePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Title, TextInput, Textarea, NumberInput, Select, MultiSelect, Button, Group, Paper, Divider, FileInput, Text, ActionIcon, SimpleGrid, Switch, Alert, Loader } from '@mantine/core';
import { IconArrowLeft, IconUpload, IconTrash, IconPlus, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import Header from '../components/Header';
import recipeService from '../services/recipe-service';
import categoryService from '../services/category-service';
import uploadService from '../services/upload-service';

function CreateRecipePage() {
  const navigate = useNavigate();

  // Recipe details state
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeDescription, setRecipeDescription] = useState('');
  const [servings, setServings] = useState(4);
  const [prepTime, setPrepTime] = useState(15);
  const [cookTime, setCookTime] = useState(30);
  const [difficulty, setDifficulty] = useState('Medium');
  const [cuisine, setCuisine] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [mainImageUrl, setMainImageUrl] = useState('');

  // Ingredients state
  const [ingredients, setIngredients] = useState([{ id: 1, name: '', amount: '', unit: '' }]);

  // Instructions state
  const [steps, setSteps] = useState([{ id: 1, description: '', image: null, imageUrl: '' }]);

  // Recipe notes
  const [notes, setNotes] = useState('');

  // Nutrition information
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  // Privacy settings
  const [isPublic, setIsPublic] = useState(true);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form options
  const [difficultyOptions] = useState([
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' }
  ]);

  const [cuisineOptions] = useState([
    { value: 'Italian', label: 'Italian' },
    { value: 'Mexican', label: 'Mexican' },
    { value: 'Chinese', label: 'Chinese' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Indian', label: 'Indian' },
    { value: 'French', label: 'French' },
    { value: 'Thai', label: 'Thai' },
    { value: 'Mediterranean', label: 'Mediterranean' },
    { value: 'American', label: 'American' },
    { value: 'Other', label: 'Other' }
  ]);

  const [unitOptions] = useState([
    { value: 'g', label: 'grams (g)' },
    { value: 'kg', label: 'kilograms (kg)' },
    { value: 'ml', label: 'milliliters (ml)' },
    { value: 'l', label: 'liters (l)' },
    { value: 'tsp', label: 'teaspoons (tsp)' },
    { value: 'tbsp', label: 'tablespoons (tbsp)' },
    { value: 'cup', label: 'cups' },
    { value: 'oz', label: 'ounces (oz)' },
    { value: 'lb', label: 'pounds (lb)' },
    { value: 'pinch', label: 'pinch' },
    { value: 'piece', label: 'piece(s)' },
    { value: '', label: 'none' }
  ]);

  const [tagOptions] = useState([
    { value: 'Vegetarian', label: 'Vegetarian' },
    { value: 'Vegan', label: 'Vegan' },
    { value: 'Gluten-Free', label: 'Gluten-Free' },
    { value: 'Dairy-Free', label: 'Dairy-Free' },
    { value: 'Low-Carb', label: 'Low-Carb' },
    { value: 'Keto', label: 'Keto' },
    { value: 'Paleo', label: 'Paleo' },
    { value: 'High-Protein', label: 'High-Protein' },
    { value: 'Low-Fat', label: 'Low-Fat' },
    { value: 'Quick', label: 'Quick' },
    { value: 'Budget', label: 'Budget' },
    { value: 'Kid-Friendly', label: 'Kid-Friendly' },
    { value: 'Dessert', label: 'Dessert' },
    { value: 'Breakfast', label: 'Breakfast' },
    { value: 'Lunch', label: 'Lunch' },
    { value: 'Dinner', label: 'Dinner' },
    { value: 'Snack', label: 'Snack' },
    { value: 'Appetizer', label: 'Appetizer' },
    { value: 'Side Dish', label: 'Side Dish' },
    { value: 'Main Course', label: 'Main Course' }
  ]);
  
  const [categoryOptions, setCategoryOptions] = useState([]);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoryService.getCategories();
        const formattedCategories = categoriesData.map(cat => ({
          value: cat.name,
          label: cat.name
        }));
        setCategoryOptions(formattedCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again.');
      }
    };
    
    fetchCategories();
  }, []);

  // Handler functions
  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page in history
  };

  const addIngredient = () => {
    const newId = ingredients.length > 0 ? Math.max(...ingredients.map(i => i.id)) + 1 : 1;
    setIngredients([...ingredients, { id: newId, name: '', amount: '', unit: '' }]);
  };

  const removeIngredient = (id) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
    }
  };

  const updateIngredient = (id, field, value) => {
    setIngredients(ingredients.map(ingredient =>
      ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
    ));
  };

  const addStep = () => {
    const newId = steps.length > 0 ? Math.max(...steps.map(s => s.id)) + 1 : 1;
    setSteps([...steps, { id: newId, description: '', image: null, imageUrl: '' }]);
  };

  const removeStep = (id) => {
    if (steps.length > 1) {
      setSteps(steps.filter(step => step.id !== id));
    }
  };

  const updateStep = (id, field, value) => {
    setSteps(steps.map(step =>
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const handleUploadMainImage = async (file) => {
    if (!file) return;
    
    setUploading(true);
    setError('');
    
    try {
      const response = await uploadService.uploadImage(file);
      setMainImageUrl(response.imageUrl);
      setUploading(false);
    } catch (err) {
      console.error('Error uploading main image:', err);
      setError('Failed to upload image. Please try again.');
      setUploading(false);
    }
  };

  const handleUploadStepImage = async (file, stepId) => {
    if (!file) return;
    
    setUploading(true);
    setError('');
    
    try {
      const response = await uploadService.uploadImage(file);
      
      // Update the step with the new image URL
      setSteps(steps.map(step =>
        step.id === stepId ? { ...step, imageUrl: response.imageUrl } : step
      ));
      
      setUploading(false);
    } catch (err) {
      console.error('Error uploading step image:', err);
      setError('Failed to upload image. Please try again.');
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Form validation
    if (!recipeTitle) {
      setError('Please enter a recipe title');
      setLoading(false);
      return;
    }

    if (!recipeDescription) {
      setError('Please enter a recipe description');
      setLoading(false);
      return;
    }

    if (ingredients.some(ingredient => !ingredient.name)) {
      setError('Please fill in all ingredient names');
      setLoading(false);
      return;
    }

    if (steps.some(step => !step.description)) {
      setError('Please fill in all instruction steps');
      setLoading(false);
      return;
    }

    try {
      // Prepare recipe data for submission
      const recipeData = {
        title: recipeTitle,
        description: recipeDescription,
        ingredients: ingredients.map(({ name, amount, unit }) => ({ name, amount, unit })),
        steps: steps.map(({ description, imageUrl }) => ({ description, image: imageUrl })),
        prepTime,
        cookTime,
        servings,
        difficulty,
        cuisine,
        category,
        tags,
        mainImage: mainImageUrl,
        notes,
        isPublic,
        nutrition: {
          calories,
          protein,
          carbs,
          fat
        }
      };
      
      const createdRecipe = await recipeService.createRecipe(recipeData);
      
      setSuccess('Recipe created successfully!');
      
      // Navigate to the recipe detail page after submission
      setTimeout(() => {
        navigate(`/recipe/${createdRecipe._id}`);
      }, 1500);
    } catch (err) {
      console.error('Error creating recipe:', err);
      setError(err.message || 'Failed to create recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Header />
      {/* Back Button */}
      <Button
        leftSection={<IconArrowLeft size={16} />}
        variant="subtle"
        color="gray"
        onClick={handleGoBack}
        mb="md"
      >
        Back
      </Button>
      <Box p="xl">
        {error && (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="Error" 
            color="red" 
            mb="lg"
            withCloseButton
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert 
            icon={<IconCheck size={16} />} 
            title="Success" 
            color="green" 
            mb="lg"
          >
            {success}
          </Alert>
        )}
        
        <Paper shadow="md" p="xl" withBorder>
          <Title order={1} mb="lg">Create New Recipe</Title>

          <form onSubmit={handleSubmit}>
            {/* Basic Recipe Information */}
            <Title order={3} mb="md">Recipe Details</Title>

            <TextInput
              label="Recipe Title"
              placeholder="Enter a descriptive title"
              value={recipeTitle}
              onChange={(e) => setRecipeTitle(e.target.value)}
              required
              mb="md"
            />

            <Textarea
              label="Description"
              placeholder="Describe your recipe briefly"
              minRows={3}
              value={recipeDescription}
              onChange={(e) => setRecipeDescription(e.target.value)}
              required
              mb="md"
            />

            <Group grow mb="md">
              <NumberInput
                label="Servings"
                placeholder="Number of servings"
                value={servings}
                onChange={(val) => setServings(val)}
                min={1}
                max={50}
              />

              <NumberInput
                label="Prep Time (minutes)"
                placeholder="Preparation time"
                value={prepTime}
                onChange={(val) => setPrepTime(val)}
                min={0}
                max={300}
              />

              <NumberInput
                label="Cook Time (minutes)"
                placeholder="Cooking time"
                value={cookTime}
                onChange={(val) => setCookTime(val)}
                min={0}
                max={300}
              />
            </Group>

            <Group grow mb="md">
              <Select
                label="Difficulty"
                placeholder="Select difficulty level"
                data={difficultyOptions}
                value={difficulty}
                onChange={setDifficulty}
              />

              <Select
                label="Cuisine"
                placeholder="Select cuisine type"
                data={cuisineOptions}
                value={cuisine}
                onChange={setCuisine}
                searchable
              />
              
              <Select
                label="Category"
                placeholder="Select recipe category"
                data={categoryOptions}
                value={category}
                onChange={setCategory}
                searchable
              />
            </Group>

            <MultiSelect
              label="Tags"
              placeholder="Select tags for your recipe"
              data={tagOptions}
              value={tags}
              onChange={setTags}
              searchable
              mb="md"
            />

            <FileInput
              label="Main Recipe Image"
              placeholder="Upload a photo of your finished dish"
              accept="image/*"
              value={mainImage}
              onChange={(file) => {
                setMainImage(file);
                handleUploadMainImage(file);
              }}
              icon={<IconUpload size={14} />}
              mb="xl"
              disabled={uploading}
            />
            
            {mainImageUrl && (
              <Box mb="xl">
                <Text size="sm" mb="xs">Preview:</Text>
                <img 
                  src={mainImageUrl} 
                  alt="Recipe preview" 
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} 
                />
              </Box>
            )}

            <Divider my="xl" />

            {/* Ingredients Section */}
            <Title order={3} mb="md">Ingredients</Title>

            {ingredients.map((ingredient, index) => (
              <Group key={ingredient.id} mb="md" align="flex-end">
                <TextInput
                  label={index === 0 ? "Ingredient" : ""}
                  placeholder="e.g. Onion, Chicken breast"
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                  required
                  style={{ flex: 2 }}
                />

                <TextInput
                  label={index === 0 ? "Amount" : ""}
                  placeholder="e.g. 2, 1/2"
                  value={ingredient.amount}
                  onChange={(e) => updateIngredient(ingredient.id, 'amount', e.target.value)}
                  style={{ flex: 1 }}
                />

                <Select
                  label={index === 0 ? "Unit" : ""}
                  placeholder="Select unit"
                  data={unitOptions}
                  value={ingredient.unit}
                  onChange={(value) => updateIngredient(ingredient.id, 'unit', value)}
                  style={{ flex: 1 }}
                  searchable
                />

                <ActionIcon
                  color="red"
                  onClick={() => removeIngredient(ingredient.id)}
                  disabled={ingredients.length === 1}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ))}

            <Button
              leftSection={<IconPlus size={14} />}
              variant="outline"
              onClick={addIngredient}
              mb="xl"
            >
              Add Ingredient
            </Button>

            <Divider my="xl" />

            {/* Instructions Section */}
            <Title order={3} mb="md">Instructions</Title>

            {steps.map((step, index) => (
              <Box key={step.id} mb="lg">
                <Group mb="xs" position="apart">
                  <Text fw={500}>Step {index + 1}</Text>

                  <ActionIcon
                    color="red"
                    onClick={() => removeStep(step.id)}
                    disabled={steps.length === 1}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>

                <Textarea
                  placeholder="Describe this step"
                  minRows={2}
                  value={step.description}
                  onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                  required
                  mb="md"
                />

                <FileInput
                  placeholder="Add photo for this step (optional)"
                  accept="image/*"
                  value={step.image}
                  onChange={(file) => {
                    updateStep(step.id, 'image', file);
                    handleUploadStepImage(file, step.id);
                  }}
                  icon={<IconUpload size={14} />}
                  disabled={uploading}
                />
                
                {step.imageUrl && (
                  <Box mt="md">
                    <Text size="sm" mb="xs">Preview:</Text>
                    <img 
                      src={step.imageUrl} 
                      alt={`Step ${index + 1} preview`} 
                      style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }} 
                    />
                  </Box>
                )}
              </Box>
            ))}

            <Button
              leftSection={<IconPlus size={14} />}
              variant="outline"
              onClick={addStep}
              mb="xl"
            >
              Add Step
            </Button>

            <Divider my="xl" />

            {/* Additional Information */}
            <Title order={3} mb="md">Additional Information</Title>

            <Textarea
              label="Recipe Notes (Optional)"
              placeholder="Add any tips, variations, or additional notes"
              minRows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              mb="xl"
            />

            <Title order={4} mb="md">Nutrition Information (Optional)</Title>

            <SimpleGrid cols={4} mb="xl">
              <TextInput
                label="Calories"
                placeholder="e.g. 250"
                rightSection="kcal"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />

              <TextInput
                label="Protein"
                placeholder="e.g. 15"
                rightSection="g"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />

              <TextInput
                label="Carbohydrates"
                placeholder="e.g. 30"
                rightSection="g"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
              />

              <TextInput
                label="Fat"
                placeholder="e.g. 10"
                rightSection="g"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
              />
            </SimpleGrid>

            <Divider my="xl" />

            {/* Privacy Settings */}
            <Title order={3} mb="md">Privacy Settings</Title>

            <Group mb="xl">
              <Switch
                label="Make this recipe public"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
            </Group>

            {/* Submit Buttons */}
            <Group position="right" mt="xl">
              <Button variant="outline" onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                color="orange"
                loading={loading || uploading}
              >
                Publish Recipe
              </Button>
            </Group>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}

export default CreateRecipePage;