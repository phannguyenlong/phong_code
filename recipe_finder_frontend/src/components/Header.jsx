// src/components/Header.jsx
import { Group, Button, Image, Menu, Avatar, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconLogout, IconUser, IconHeart, IconBookmark, IconSettings } from '@tabler/icons-react';

function Header() {
  const { currentUser, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // No need to navigate as ProtectedRoute will handle redirection
  };

  return (
    <div className="header">
      <Group>
        <Link to="/">
          <Image 
            src="https://static.cookpad.com/global/logo.png"
            alt="Recipe Finder"
            width={100}
          />
        </Link>
      </Group>
      <Group>
        {isAuthenticated ? (
          <Menu position="bottom-end" shadow="md" width={200}>
            <Menu.Target>
              <Button variant="subtle">
                <Group>
                  <Avatar color="orange" radius="xl" size="sm">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Text size="sm">{currentUser.username}</Text>
                </Group>
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item leftSection={<IconUser size={14} />} component={Link} to="/account">
                Profile
              </Menu.Item>
              <Menu.Item leftSection={<IconHeart size={14} />} component={Link} to="/recipes?tab=favorites">
                Favorites
              </Menu.Item>
              <Menu.Item leftSection={<IconBookmark size={14} />} component={Link} to="/recipes?tab=saved">
                Saved Recipes
              </Menu.Item>
              <Menu.Item leftSection={<IconSettings size={14} />} component={Link} to="/account">
                Settings
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<IconLogout size={14} />} onClick={handleLogout} color="red">
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <>
            <Button component={Link} to="/login" variant="subtle">Login</Button>
            <Button component={Link} to="/register" color="orange">Register</Button>
          </>
        )}
      </Group>
    </div>
  );
}

export default Header;