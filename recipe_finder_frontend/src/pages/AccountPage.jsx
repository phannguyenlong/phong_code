// src/pages/AccountPage.jsx
import { useState, useEffect } from 'react';
import { Box, Title, Text, Card, Avatar, Grid, Button, TextInput, PasswordInput, Switch, Divider, Group, List, Alert, Loader, Center, Modal } from '@mantine/core';
import { IconUser, IconAt, IconSettings, IconBell, IconReceipt, IconLogout, IconAlertCircle, IconCheck, IconTrash } from '@tabler/icons-react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import userService from '../services/user-service';
import { useNavigate } from 'react-router-dom';

function AccountPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // Profile state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    weeklyRecommendations: true,
    darkMode: false,
    metricUnits: true,
    publicProfile: true
  });
  
  // User stats
  const [recipeCount, setRecipeCount] = useState(0);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    // Load user profile data
    const loadUserProfile = async () => {
      setLoading(true);
      setError('');
      
      try {
        const userData = await userService.getUserProfile();
        
        // Set profile data
        setUsername(userData.username || '');
        setEmail(userData.email || '');
        setLocation(userData.location || '');
        
        // Set preferences
        if (userData.preferences) {
          setPreferences({
            emailNotifications: userData.preferences.emailNotifications ?? true,
            weeklyRecommendations: userData.preferences.weeklyRecommendations ?? true,
            darkMode: userData.preferences.darkMode ?? false,
            metricUnits: userData.preferences.metricUnits ?? true,
            publicProfile: userData.preferences.publicProfile ?? true
          });
        }
        
        // Get recipe count
        const userRecipes = await userService.getUserRecipes();
        setRecipeCount(userRecipes.length);
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      loadUserProfile();
    }
  }, [currentUser]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');
    
    // Validate password fields if any are filled
    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        setError('Current password is required to change password');
        setSaving(false);
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match');
        setSaving(false);
        return;
      }
    }
    
    try {
      const profileData = {
        username,
        email,
        location,
        preferences
      };
      
      // Only include password fields if changing password
      if (newPassword && currentPassword) {
        profileData.password = newPassword;
        profileData.currentPassword = currentPassword;
      }
      
      await userService.updateUserProfile(profileData);
      
      setSuccessMessage('Profile updated successfully');
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError('Please enter your password to confirm account deletion');
      return;
    }

    setDeleteLoading(true);
    setDeleteError('');

    try {
      const result = await userService.deleteAccount(deletePassword);
      if (result && result.message === 'User account deleted successfully') {
        logout();
        navigate('/');
      } else {
        setDeleteError('Failed to delete account. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      setDeleteError(err.message || 'Failed to delete account. Please check your password and try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Header />
        <Box py={100}>
          <Center>
            <Loader size="xl" />
          </Center>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Header />
      <Box p="xl">
        <Grid>
          {/* Left side - Account info */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section p="lg" style={{ textAlign: 'center' }}>
                <Avatar 
                  size={120} 
                  radius={120} 
                  mx="auto" 
                  color="orange" 
                  src={null}
                >
                  <IconUser size={80} />
                </Avatar>
                <Title order={3} mt="md">{username}</Title>
                <Text c="dimmed">@{username.toLowerCase()}</Text>
                <Text size="sm" mt="xs">{location}</Text>
              </Card.Section>
              
              <List spacing="xs" mt="md" center>
                <List.Item icon={<IconReceipt size={16} />}>{recipeCount} Recipes Created</List.Item>
                <List.Item icon={<IconAt size={16} />}>{email}</List.Item>
                <List.Item icon={<IconBell size={16} />}>
                  Notifications: {preferences.emailNotifications ? 'On' : 'Off'}
                </List.Item>
              </List>
              
              <Divider my="md" />
              
              <Group position="center" spacing="xs">
                <Button 
                  variant="subtle" 
                  leftSection={<IconLogout size={16} />} 
                  color="red"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
                <Button
                  variant="subtle"
                  leftSection={<IconTrash size={16} />}
                  color="red"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  Delete Account
                </Button>
              </Group>
            </Card>
          </Grid.Col>
          
          {/* Right side - Account settings */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            {successMessage && (
              <Alert 
                icon={<IconCheck size={16} />} 
                title="Success" 
                color="green" 
                mb="md"
                onClose={() => setSuccessMessage('')}
                withCloseButton
              >
                {successMessage}
              </Alert>
            )}
            
            {error && (
              <Alert 
                icon={<IconAlertCircle size={16} />} 
                title="Error" 
                color="red" 
                mb="md"
                onClose={() => setError('')}
                withCloseButton
              >
                {error}
              </Alert>
            )}
            
            <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
              <Group mb="md">
                <IconSettings size={20} />
                <Title order={3}>Account Settings</Title>
              </Group>
              
              <form onSubmit={handleSaveProfile}>
                <TextInput
                  label="Display Name"
                  placeholder="Your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  mb="md"
                  required
                />
                
                <TextInput
                  label="Email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  mb="md"
                  required
                />
                
                <TextInput
                  label="Location"
                  placeholder="Your location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  mb="md"
                />
                
                <Divider my="md" label="Change Password" labelPosition="center" />
                
                <PasswordInput
                  label="Current Password"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  mb="md"
                />
                
                <PasswordInput
                  label="New Password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  mb="md"
                />
                
                <PasswordInput
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  mb="md"
                />
                
                <Button 
                  color="orange" 
                  mt="md" 
                  type="submit"
                  loading={saving}
                >
                  Save Changes
                </Button>
              </form>
            </Card>
            
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} mb="md">Preferences</Title>
              
              <Switch 
                label="Email notifications for new cooking challenges" 
                checked={preferences.emailNotifications}
                onChange={(e) => setPreferences({
                  ...preferences,
                  emailNotifications: e.currentTarget.checked
                })}
                mb="md"
              />
              
              <Switch 
                label="Receive weekly recipe recommendations" 
                checked={preferences.weeklyRecommendations}
                onChange={(e) => setPreferences({
                  ...preferences,
                  weeklyRecommendations: e.currentTarget.checked
                })}
                mb="md"
              />
              
              <Switch 
                label="Dark mode" 
                checked={preferences.darkMode}
                onChange={(e) => setPreferences({
                  ...preferences,
                  darkMode: e.currentTarget.checked
                })}
                mb="md"
              />
              
              <Switch 
                label="Show measurements in metric units (g, ml)" 
                checked={preferences.metricUnits}
                onChange={(e) => setPreferences({
                  ...preferences,
                  metricUnits: e.currentTarget.checked
                })}
                mb="md"
              />
              
              <Switch 
                label="Make profile public" 
                checked={preferences.publicProfile}
                onChange={(e) => setPreferences({
                  ...preferences,
                  publicProfile: e.currentTarget.checked
                })}
                mb="md"
              />
              
              <Divider my="md" labelPosition="center" label="Privacy" />
              
              <Text size="sm" c="dimmed" mb="md">
                We value your privacy. Your account information is only used to enhance your experience on Recipe Finder.
              </Text>
              
              <Button 
                variant="outline" 
                color="gray"
                onClick={handleSaveProfile}
                loading={saving}
              >
                Save Preferences
              </Button>
            </Card>
          </Grid.Col>
        </Grid>
      </Box>

      {/* Delete Account Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Account"
        centered
      >
        <Text size="sm" mb="md">
          Are you sure you want to delete your account? This action cannot be undone.
        </Text>
        
        <PasswordInput
          label="Enter your password to confirm"
          placeholder="Your password"
          value={deletePassword}
          onChange={(e) => setDeletePassword(e.target.value)}
          mb="md"
          required
        />
        
        {deleteError && (
          <Alert color="red" mb="md">
            {deleteError}
          </Alert>
        )}
        
        <Group position="right" mt="md">
          <Button variant="subtle" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button 
            color="red" 
            onClick={handleDeleteAccount}
            loading={deleteLoading}
          >
            Delete Account
          </Button>
        </Group>
      </Modal>
    </Box>
  );
}

export default AccountPage;