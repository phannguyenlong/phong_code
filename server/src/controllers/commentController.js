import Comment from '../models/commentModel.js';
import Recipe from '../models/recipeModel.js';

// @desc    Get comments for a recipe
// @route   GET /api/comments/recipe/:id
// @access  Public
export const getRecipeComments = async (req, res) => {
  try {
    const comments = await Comment.find({ recipe: req.params.id })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a comment
// @route   POST /api/comments
// @access  Private
export const createComment = async (req, res) => {
  try {
    const { recipeId, content, rating } = req.body;
    
    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Check if user already commented
    const existingComment = await Comment.findOne({
      recipe: recipeId,
      user: req.user._id
    });
    
    if (existingComment) {
      return res.status(400).json({ message: 'You have already reviewed this recipe' });
    }
    
    const comment = new Comment({
      content,
      rating,
      recipe: recipeId,
      user: req.user._id
    });
    
    const createdComment = await comment.save();
    
    // Update recipe rating
    const comments = await Comment.find({ recipe: recipeId });
    const averageRating = 
      comments.reduce((acc, item) => item.rating + acc, 0) / comments.length;
    
    recipe.rating = Number(averageRating.toFixed(1));
    recipe.reviewCount = comments.length;
    await recipe.save();
    
    // Populate user data for response
    const populatedComment = await Comment.findById(createdComment._id)
      .populate('user', 'username avatar');
    
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req, res) => {
  try {
    const { content, rating } = req.body;
    
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is comment owner
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }
    
    comment.content = content || comment.content;
    
    if (rating && rating !== comment.rating) {
      comment.rating = rating;
      
      // Update recipe rating
      const recipe = await Recipe.findById(comment.recipe);
      const comments = await Comment.find({ recipe: comment.recipe });
      const averageRating = 
        comments.reduce((acc, item) => item.rating + acc, 0) / comments.length;
      
      recipe.rating = Number(averageRating.toFixed(1));
      await recipe.save();
    }
    
    const updatedComment = await comment.save();
    
    // Populate user data for response
    const populatedComment = await Comment.findById(updatedComment._id)
      .populate('user', 'username avatar');
    
    res.json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is comment owner
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    const recipeId = comment.recipe;
    
    await comment.deleteOne();
    
    // Update recipe rating
    const recipe = await Recipe.findById(recipeId);
    const comments = await Comment.find({ recipe: recipeId });
    
    if (comments.length > 0) {
      const averageRating = 
        comments.reduce((acc, item) => item.rating + acc, 0) / comments.length;
      
      recipe.rating = Number(averageRating.toFixed(1));
    } else {
      recipe.rating = 0;
    }
    
    recipe.reviewCount = comments.length;
    await recipe.save();
    
    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
