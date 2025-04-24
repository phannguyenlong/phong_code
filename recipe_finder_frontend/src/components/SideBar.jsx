// src/components/SideBar.jsx
import { Image, Text, Group, Button, TextInput, Stack, NavLink } from '@mantine/core';
import { IconSearch, IconHome, IconUser, IconFolders, IconLogout, IconPlus } from '@tabler/icons-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, currentUser, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="sidebar">
      <form onSubmit={handleSearch}>
        <TextInput
          placeholder="Search"
          leftSection={<IconSearch size={16} />}
          mb={20}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      <Stack gap={10}>
        <NavLink
          component={Link}
          to="/"
          label="Home"
          leftSection={<IconHome size={18} />}
          active={location.pathname === '/'}
        />
        <NavLink
          component={Link}
          to="/search"
          label="Search"
          leftSection={<IconSearch size={18} />}
          active={location.pathname === '/search'}
        />
        <NavLink
          component={Link}
          to="/account"
          label="Account"
          leftSection={<IconUser size={18} />}
          active={location.pathname === '/account'}
        />
        <NavLink
          component={Link}
          to="/recipes"
          label="Recipes"
          leftSection={<IconFolders size={18} />}
          active={location.pathname === '/recipes'}
        />
      </Stack>

      {isAuthenticated ? (
        <div>
          <Text size="sm" fw={500} mt={30} mb={10}>
            Welcome, {currentUser.username}!
          </Text>
          
          <Button 
            leftSection={<IconPlus size={16} />} 
            color="orange" 
            fullWidth 
            mb={10}
            component={Link}
            to="/create-recipe"
          >
            Create Recipe
          </Button>
          
          <Button 
            leftSection={<IconLogout size={16} />} 
            variant="subtle" 
            color="gray" 
            fullWidth
            onClick={() => logout()}
          >
            Logout
          </Button>
        </div>
      ) : (
        <Text size="sm" mt={20} color="gray">
          To start creating your recipe library, please{' '}
          <Text component={Link} to="/register" c="blue" inherit>
            register
          </Text>{' '}
          or{' '}
          <Text component={Link} to="/login" c="blue" inherit>
            login
          </Text>
          .
        </Text>
      )}
    </div>
  );
}

export default SideBar;