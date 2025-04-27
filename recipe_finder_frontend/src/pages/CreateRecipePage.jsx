// src/pages/CreateRecipePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Title, TextInput, Textarea, NumberInput, Select, MultiSelect, Button, Group, Paper, Divider, FileInput, Text, ActionIcon, SimpleGrid, Switch, Alert, Loader } from '@mantine/core';
import { IconArrowLeft, IconUpload, IconTrash, IconPlus, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import Header from '../components/Header';
import recipeService from '../services/recipe-service';
import categoryService from '../services/category-service';
import uploadService from '../services/upload-service';
import imageUtils from '../utils/image-utils';

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
  
  const [categoryOptions, setCategoryOptions] = useState([
    { value: 'Breakfast', label: 'Breakfast' },
    { value: 'Lunch', label: 'Lunch' },
    { value: 'Dinner', label: 'Dinner' },
    { value: 'Appetizer', label: 'Appetizer' },
    { value: 'Main Course', label: 'Main Course' },
    { value: 'Side Dish', label: 'Side Dish' },
    { value: 'Dessert', label: 'Dessert' },
    { value: 'Snack', label: 'Snack' },
    { value: 'Beverage', label: 'Beverage' },
    { value: 'Baked Goods', label: 'Baked Goods' },
    { value: 'Salad', label: 'Salad' },
    { value: 'Soup', label: 'Soup' }
  ]);

  // Form validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoryService.getCategories();
        // Transform data for select component
        const formattedCategories = categoriesData.map(cat => ({
          value: cat.name,
          label: cat.name,
          description: cat.description
        }));
        if (formattedCategories && formattedCategories.length > 0) {
          setCategoryOptions(formattedCategories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Keep using default categories if API fails
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

  const validateField = (name, value) => {
    switch (name) {
      case 'recipeTitle':
        if (!value.trim()) {
          return 'Recipe title is required';
        }
        if (value.length < 3) {
          return 'Title must be at least 3 characters long';
        }
        if (value.length > 100) {
          return 'Title must be less than 100 characters';
        }
        return '';
      
      case 'recipeDescription':
        if (!value.trim()) {
          return 'Description is required';
        }
        if (value.length < 20) {
          return 'Description must be at least 20 characters long';
        }
        return '';
      
      case 'servings':
        if (value < 1) {
          return 'Servings must be at least 1';
        }
        if (value > 50) {
          return 'Servings cannot exceed 50';
        }
        return '';
      
      case 'prepTime':
        if (value < 0) {
          return 'Prep time cannot be negative';
        }
        if (value > 480) {
          return 'Prep time cannot exceed 8 hours (480 minutes)';
        }
        return '';
      
      case 'cookTime':
        if (value < 0) {
          return 'Cook time cannot be negative';
        }
        if (value > 1440) {
          return 'Cook time cannot exceed 24 hours (1440 minutes)';
        }
        return '';
      
      case 'cuisine':
        if (!value.trim()) {
          return 'Please select a cuisine type';
        }
        return '';
      
      case 'category':
        if (!value.trim()) {
          return 'Please select a category';
        }
        return '';
      
      case 'mainImage':
        if (!value) {
          return 'Please upload a main image for your recipe';
        }
        return '';
      
      default:
        return '';
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, 
      field === 'recipeTitle' ? recipeTitle :
      field === 'recipeDescription' ? recipeDescription :
      field === 'servings' ? servings :
      field === 'prepTime' ? prepTime :
      field === 'cookTime' ? cookTime :
      field === 'cuisine' ? cuisine :
      field === 'category' ? category :
      field === 'mainImage' ? mainImageUrl : ''
    );
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateIngredients = () => {
    const ingredientErrors = ingredients.map(ingredient => {
      const errors = {};
      if (!ingredient.name.trim()) {
        errors.name = 'Ingredient name is required';
      }
      if (ingredient.amount && isNaN(parseFloat(ingredient.amount))) {
        errors.amount = 'Amount must be a number';
      }
      return errors;
    });
    return ingredientErrors;
  };

  const validateSteps = () => {
    const stepErrors = steps.map(step => {
      const errors = {};
      const description = step.description.trim();
      if (!description) {
        errors.description = 'Step description is required';
      } else if (description.length < 10) {
        errors.description = 'Step description must be at least 10 characters';
      }
      return errors;
    });
    return stepErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate all fields
    const newErrors = {};
    const fields = [
      'recipeTitle',
      'recipeDescription',
      'servings',
      'prepTime',
      'cookTime',
      'cuisine',
      'category',
      'mainImage'
    ];

    fields.forEach(field => {
      const error = validateField(field, 
        field === 'recipeTitle' ? recipeTitle :
        field === 'recipeDescription' ? recipeDescription :
        field === 'servings' ? servings :
        field === 'prepTime' ? prepTime :
        field === 'cookTime' ? cookTime :
        field === 'cuisine' ? cuisine :
        field === 'category' ? category :
        field === 'mainImage' ? mainImageUrl : ''
      );
      if (error) newErrors[field] = error;
    });

    // Validate ingredients and steps
    const ingredientErrors = validateIngredients();
    const stepErrors = validateSteps();

    if (ingredientErrors.some(err => Object.keys(err).length > 0)) {
      newErrors.ingredients = ingredientErrors;
    }

    if (stepErrors.some(err => Object.keys(err).length > 0)) {
      newErrors.steps = stepErrors;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      setError('Please fix the validation errors before submitting.');
      return;
    }

    try {
      console.log('Preparing recipe data for submission...');
      // Prepare recipe data for submission
      const recipeData = {
        title: recipeTitle,
        description: recipeDescription,
        ingredients: ingredients.map(({ name, amount, unit }) => ({ 
          name: name.trim(),
          amount: amount.trim(),
          unit: unit || ''
        })).filter(ing => ing.name || ing.amount),
        instructions: steps.map(({ description, imageUrl }, index) => ({
          stepNumber: index + 1,
          description: description.trim(),
          image: imageUrl || ''
        })).filter(step => step.description),
        prepTime: Number(prepTime),
        cookTime: Number(cookTime),
        servings: Number(servings),
        difficulty,
        cuisine,
        category,
        tags,
        mainImage: mainImageUrl,
        notes: notes.trim(),
        isPublic,
        nutrition: {
          calories: calories ? Number(calories) : null,
          protein: protein ? Number(protein) : null,
          carbs: carbs ? Number(carbs) : null,
          fat: fat ? Number(fat) : null
        }
      };

      console.log('Submitting recipe data:', recipeData);
      const createdRecipe = await recipeService.createRecipe(recipeData);
      console.log('Recipe created successfully:', createdRecipe);
      
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
              placeholder="Enter a descriptive title for your recipe"
              value={recipeTitle}
              onChange={(e) => setRecipeTitle(e.target.value)}
              onBlur={() => handleBlur('recipeTitle')}
              error={touched.recipeTitle && errors.recipeTitle}
              required
              mb="md"
            />

            <Textarea
              label="Description"
              placeholder="Describe your recipe, including any special notes or tips"
              value={recipeDescription}
              onChange={(e) => setRecipeDescription(e.target.value)}
              onBlur={() => handleBlur('recipeDescription')}
              error={touched.recipeDescription && errors.recipeDescription}
              minRows={3}
              required
              mb="md"
            />

            <Group grow mb="md">
              <NumberInput
                label="Servings"
                description="Number of people this recipe serves"
                value={servings}
                onChange={setServings}
                onBlur={() => handleBlur('servings')}
                error={touched.servings && errors.servings}
                min={1}
                max={50}
                required
              />

              <NumberInput
                label="Prep Time (minutes)"
                description="Time needed for preparation"
                value={prepTime}
                onChange={setPrepTime}
                onBlur={() => handleBlur('prepTime')}
                error={touched.prepTime && errors.prepTime}
                min={0}
                max={480}
                required
              />

              <NumberInput
                label="Cook Time (minutes)"
                description="Time needed for cooking"
                value={cookTime}
                onChange={setCookTime}
                onBlur={() => handleBlur('cookTime')}
                error={touched.cookTime && errors.cookTime}
                min={0}
                max={1440}
                required
              />
            </Group>

            <Group grow mb="md">
              <Select
                label="Difficulty"
                description="How challenging is this recipe?"
                value={difficulty}
                onChange={setDifficulty}
                data={difficultyOptions}
                required
              />

              <Select
                label="Cuisine"
                description="Type of cuisine (e.g., Italian, Chinese)"
                value={cuisine}
                onChange={setCuisine}
                onBlur={() => handleBlur('cuisine')}
                error={touched.cuisine && errors.cuisine}
                data={cuisineOptions}
                searchable
                required
              />
              
              <Select
                label="Category"
                description="Recipe category (e.g., Breakfast, Dinner)"
                value={category}
                onChange={setCategory}
                onBlur={() => handleBlur('category')}
                error={touched.category && errors.category}
                data={categoryOptions}
                searchable
                required
              />
            </Group>

            <MultiSelect
              label="Tags"
              description="Add relevant tags to help others find your recipe"
              placeholder="Select or type tags"
              value={tags}
              onChange={setTags}
              data={tagOptions}
              searchable
              creatable
              getCreateLabel={(query) => `+ Add ${query}`}
              mb="md"
            />

            <FileInput
              label="Main Image"
              description="Upload a high-quality image of your recipe"
              placeholder="Click to upload or drag and drop"
              accept="image/*"
              value={mainImage}
              onChange={(file) => {
                setMainImage(file);
                handleUploadMainImage(file);
              }}
              onBlur={() => handleBlur('mainImage')}
              error={touched.mainImage && errors.mainImage}
              required
              mb="md"
            />
            
            {mainImageUrl && (
              <Box mb="xl">
                <Text size="sm" mb="xs">Preview:</Text>
                <img 
                  src={imageUtils.getFullImageUrl(mainImageUrl)} 
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
                  placeholder="e.g. Flour, Sugar"
                  value={ingredient.name}
                  onChange={(e) => {
                    updateIngredient(ingredient.id, 'name', e.target.value);
                    // Clear error when user starts typing
                    if (errors.ingredients?.[index]?.name) {
                      const newErrors = { ...errors };
                      if (newErrors.ingredients) {
                        newErrors.ingredients[index] = { ...newErrors.ingredients[index], name: null };
                      }
                      setErrors(newErrors);
                    }
                  }}
                  onBlur={() => {
                    if (!ingredient.name.trim()) {
                      const ingredientErrors = [...(errors.ingredients || [])];
                      ingredientErrors[index] = { ...ingredientErrors[index], name: 'Ingredient name is required' };
                      setErrors(prev => ({
                        ...prev,
                        ingredients: ingredientErrors
                      }));
                    }
                  }}
                  error={errors.ingredients?.[index]?.name}
                  style={{ flex: 2 }}
                  required
                />

                <TextInput
                  label={index === 0 ? "Amount" : ""}
                  placeholder="e.g. 2, 1/2"
                  value={ingredient.amount}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    updateIngredient(ingredient.id, 'amount', newValue);
                    // Clear error when user starts typing
                    if (errors.ingredients?.[index]?.amount) {
                      const newErrors = { ...errors };
                      if (newErrors.ingredients) {
                        newErrors.ingredients[index] = { ...newErrors.ingredients[index], amount: null };
                      }
                      setErrors(newErrors);
                    }
                  }}
                  onBlur={() => {
                    const value = ingredient.amount.trim();
                    if (value && (isNaN(value) || isNaN(parseFloat(value)))) {
                      const ingredientErrors = [...(errors.ingredients || [])];
                      ingredientErrors[index] = { ...ingredientErrors[index], amount: 'Amount must be a number' };
                      setErrors(prev => ({
                        ...prev,
                        ingredients: ingredientErrors
                      }));
                    } else {
                      // Clear error if value is valid or empty
                      const newErrors = { ...errors };
                      if (newErrors.ingredients?.[index]?.amount) {
                        newErrors.ingredients[index] = { ...newErrors.ingredients[index], amount: null };
                        setErrors(newErrors);
                      }
                    }
                  }}
                  error={errors.ingredients?.[index]?.amount}
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
                  placeholder="Describe this step in detail"
                  value={step.description}
                  onChange={(e) => {
                    updateStep(step.id, 'description', e.target.value);
                    // Clear error when user starts typing and meets minimum length
                    if (e.target.value.trim().length >= 10 && errors.steps?.[index]?.description) {
                      const newErrors = { ...errors };
                      if (newErrors.steps) {
                        newErrors.steps[index] = { ...newErrors.steps[index], description: null };
                      }
                      setErrors(newErrors);
                    }
                  }}
                  onBlur={() => {
                    const description = step.description.trim();
                    const stepErrors = [...(errors.steps || [])];
                    if (!description) {
                      stepErrors[index] = { ...stepErrors[index], description: 'Step description is required' };
                    } else if (description.length < 10) {
                      stepErrors[index] = { ...stepErrors[index], description: 'Step description must be at least 10 characters' };
                    } else {
                      // Clear error if valid
                      if (stepErrors[index]) {
                        stepErrors[index] = { ...stepErrors[index], description: null };
                      }
                    }
                    setErrors(prev => ({
                      ...prev,
                      steps: stepErrors
                    }));
                  }}
                  error={errors.steps?.[index]?.description}
                  minRows={2}
                  mb="md"
                  required
                />

                <FileInput
                  label="Step Image (optional)"
                  placeholder="Upload an image for this step"
                  accept="image/*"
                  value={step.image}
                  onChange={(file) => {
                    updateStep(step.id, 'image', file);
                    handleUploadStepImage(file, step.id);
                  }}
                />
                
                {step.imageUrl && (
                  <Box mt="md">
                    <Text size="sm" mb="xs">Preview:</Text>
                    <img 
                      src={imageUtils.getFullImageUrl(step.imageUrl)} 
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

            <Title order={4} mb="md">Nutrition Information (per serving)</Title>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl">
              <TextInput
                label="Calories"
                placeholder="e.g. 250"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />

              <TextInput
                label="Protein"
                placeholder="e.g. 10g"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />

              <TextInput
                label="Carbohydrates"
                placeholder="e.g. 30g"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
              />

              <TextInput
                label="Fat"
                placeholder="e.g. 8g"
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
                onChange={(event) => setIsPublic(event.currentTarget.checked)}
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