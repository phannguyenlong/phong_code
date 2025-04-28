import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  ingredients: [{
    name: { type: String, required: true },
    amount: { type: String },
    unit: { type: String }
  }],
  steps: [{
    description: { type: String, required: true },
    image: { type: String }
  }],
  prepTime: { 
    type: Number,
    default: 0
  },
  cookTime: { 
    type: Number,
    default: 0
  },
  servings: { 
    type: Number,
    default: 4
  },
  difficulty: { 
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  cuisine: { 
    type: String 
  },
  category: { 
    type: String 
  },
  tags: [{ 
    type: String 
  }],
  mainImage: { 
    type: String 
  },
  nutrition: {
    calories: { type: String },
    protein: { type: String },
    carbs: { type: String },
    fat: { type: String },
    sodium: { type: String },
    fiber: { type: String }
  },
  notes: { 
    type: String 
  },
  isPublic: { 
    type: Boolean, 
    default: true 
  },
  rating: { 
    type: Number, 
    default: 0 
  },
  reviewCount: { 
    type: Number, 
    default: 0 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
}, { 
  timestamps: true 
});

// Index for search functionality
recipeSchema.index({ 
  title: 'text', 
  description: 'text', 
  'ingredients.name': 'text',
  tags: 'text',
  cuisine: 'text',
  category: 'text'
});

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;