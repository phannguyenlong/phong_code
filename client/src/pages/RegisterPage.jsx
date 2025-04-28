// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { Paper, Title, TextInput, PasswordInput, Button, Group, Text, Divider, Anchor, Center, Checkbox, Alert } from '@mantine/core';
import { IconAt, IconLock, IconUser, IconBrandGoogle, IconBrandFacebook, IconAlertCircle } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (!terms) {
      setError("You must accept the terms and conditions");
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the register method from auth context
      await register(username, email, password);
      
      // Redirect to home page after registration
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center style={{ height: 'calc(100vh - 80px)' }}>
      <Paper radius="md" p="xl" withBorder shadow="md" style={{ width: 400 }}>
        <Title order={2} ta="center" mt="md" mb={30}>
          Create a Recipe Finder Account
        </Title>

        {error && (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="Registration Error" 
            color="red" 
            mb="md"
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextInput
            label="Username"
            placeholder="Your username"
            size="md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            leftSection={<IconUser size={16} />}
            required
            mb="md"
          />

          <TextInput
            label="Email address"
            placeholder="hello@example.com"
            size="md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftSection={<IconAt size={16} />}
            required
            mb="md"
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            size="md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftSection={<IconLock size={16} />}
            required
            mb="md"
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            size="md"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftSection={<IconLock size={16} />}
            required
            mb="md"
          />

          <Checkbox
            label="I agree to the terms and conditions"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            mb="md"
          />

          <Button fullWidth type="submit" size="md" color="orange" loading={loading}>
            Create Account
          </Button>
        </form>

        <Divider label="Or continue with" labelPosition="center" my="lg" />

        <Group grow mb="md">
          <Button variant="outline" leftSection={<IconBrandGoogle size={16} />}>
            Google
          </Button>
          <Button variant="outline" leftSection={<IconBrandFacebook size={16} />}>
            Facebook
          </Button>
        </Group>

        <Text ta="center" mt="md">
          Already have an account?{' '}
          <Anchor component={Link} to="/login" weight={700}>
            Sign in
          </Anchor>
        </Text>
      </Paper>
    </Center>
  );
}

export default RegisterPage;