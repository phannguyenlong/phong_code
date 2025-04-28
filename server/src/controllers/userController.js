import User from '../models/userModel.js';
import Recipe from '../models/recipeModel.js';
import Comment from '../models/commentModel.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.location = req.body.location || user.location;
      user.avatar = req.body.avatar || user.avatar;
      
      if (req.body.preferences) {
        user.preferences = {
          ...user.preferences,
          ...req.body.preferences
        };
      }
      
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        location: updatedUser.location,
        avatar: updatedUser.avatar,
        preferences: updatedUser.preferences,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's created recipes
// @route   GET /api/users/recipes
// @access  Private
export const getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's favorite recipes
// @route   GET /api/users/favorites
// @access  Private
export const getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'favorites',
        populate: {
          path: 'createdBy',
          select: 'username avatar'
        }
      });
    
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add recipe to favorites
// @route   POST /api/users/favorites
// @access  Private
export const addToFavorites = async (req, res) => {
  try {
    const { recipeId } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user.favorites.includes(recipeId)) {
      user.favorites.push(recipeId);
      await user.save();
    }
    
    res.json({ message: 'Recipe added to favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove recipe from favorites
// @route   DELETE /api/users/favorites/:id
// @access  Private
export const removeFromFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.favorites = user.favorites.filter(
      favorite => favorite.toString() !== req.params.id
    );
    
    await user.save();
    
    res.json({ message: 'Recipe removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's bookmarked recipes
// @route   GET /api/users/bookmarks
// @access  Private
export const getUserBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'bookmarks',
        populate: {
          path: 'createdBy',
          select: 'username avatar'
        }
      });
    
    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add recipe to bookmarks
// @route   POST /api/users/bookmarks
// @access  Private
export const addToBookmarks = async (req, res) => {
  try {
    const { recipeId } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user.bookmarks.includes(recipeId)) {
      user.bookmarks.push(recipeId);
      await user.save();
    }
    
    res.json({ message: 'Recipe added to bookmarks' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove recipe from bookmarks
// @route   DELETE /api/users/bookmarks/:id
// @access  Private
export const removeFromBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.bookmarks = user.bookmarks.filter(
      bookmark => bookmark.toString() !== req.params.id
    );
    
    await user.save();
    
    res.json({ message: 'Recipe removed from bookmarks' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's reviews/comments
// @route   GET /api/users/reviews
// @access  Private
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Comment.find({ user: req.user._id })
      .populate('recipe')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user profile
// @route   DELETE /api/users/profile
// @access  Private
export const deleteUserProfile = async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findById(req.user._id);
    
    if (user) {
      // Verify password
      const isMatch = await user.matchPassword(password);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      // Delete user's recipes
      await Recipe.deleteMany({ createdBy: req.user._id });
      
      // Delete user's comments
      await Comment.deleteMany({ user: req.user._id });
      
      // Delete the user
      await User.findByIdAndDelete(req.user._id);
      
      res.json({ message: 'User account deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: error.message });
  }
};