import { Box, Container, Grid, Group, Text, Title, List, Anchor, Divider, Image } from '@mantine/core';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" py="xl" bg="#f8f9fa" mt="auto">
      <Container size="xl">
        <Grid>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Box mb="md">
              <Image
                src="/logo.png"
                alt="Recipe Finder"
                width={50}
              />
            </Box>
            <Text size="sm" color="dimmed" mb="lg">
              Discover and share delicious recipes from around the world. Join our cooking community today!
            </Text>
            <Text size="xs" color="dimmed">
              © {currentYear} Recipe Finder. All rights reserved.
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 3 }}>
            <Title order={4} mb="md">Explore</Title>
            <List spacing="xs" size="sm" center withPadding={false}>
              <List.Item>
                <Anchor component={Link} to="/" color="dimmed">
                  Home
                </Anchor>
              </List.Item>
              <List.Item>
                <Anchor component={Link} to="/search?q=popular" color="dimmed">
                  Popular Recipes
                </Anchor>
              </List.Item>
              <List.Item>
                <Anchor component={Link} to="/search?q=recent" color="dimmed">
                  Recently Added
                </Anchor>
              </List.Item>
              <List.Item>
                <Anchor component={Link} to="/search?q=seasonal" color="dimmed">
                  Seasonal Dishes
                </Anchor>
              </List.Item>
              <List.Item>
                <Anchor component={Link} to="/create-recipe" color="dimmed">
                  Create Recipe
                </Anchor>
              </List.Item>
            </List>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 3 }}>
            <Title order={4} mb="md">Categories</Title>
            <List spacing="xs" size="sm" center withPadding={false}>
              <List.Item>
                <Anchor component={Link} to="/search?q=breakfast" color="dimmed">
                  Breakfast
                </Anchor>
              </List.Item>
              <List.Item>
                <Anchor component={Link} to="/search?q=lunch" color="dimmed">
                  Lunch
                </Anchor>
              </List.Item>
              <List.Item>
                <Anchor component={Link} to="/search?q=dinner" color="dimmed">
                  Dinner
                </Anchor>
              </List.Item>
              <List.Item>
                <Anchor component={Link} to="/search?q=dessert" color="dimmed">
                  Desserts
                </Anchor>
              </List.Item>
              <List.Item>
                <Anchor component={Link} to="/search?q=vegetarian" color="dimmed">
                  Vegetarian
                </Anchor>
              </List.Item>
            </List>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 3 }}>
            <Title order={4} mb="md">Help & Support</Title>
            <List spacing="xs" size="sm" center withPadding={false}>
              <List.Item>
                <Anchor component={Link} to="/about" color="dimmed">
                  About Us
                </Anchor>
              </List.Item>
              <List.Item>
                <Anchor component={Link} to="/contact" color="dimmed">
                  Contact
                </Anchor>
              </List.Item>
              <List.Item>
                <Anchor component={Link} to="/faq" color="dimmed">
                  FAQ
                </Anchor>
              </List.Item>
              <List.Item>
                <Anchor component={Link} to="/privacy" color="dimmed">
                  Privacy Policy
                </Anchor>
              </List.Item>
              <List.Item>
                <Anchor component={Link} to="/terms" color="dimmed">
                  Terms of Service
                </Anchor>
              </List.Item>
            </List>
          </Grid.Col>
        </Grid>

        <Divider my="lg" />

        <Group position="apart" align="center">
          <Text size="xs" color="dimmed">
            Made with ❤️ for cooking enthusiasts
          </Text>
          <Group spacing="xs">
            <Anchor href="#" target="_blank" color="dimmed" size="sm">
              Facebook
            </Anchor>
            <Text size="xs" color="dimmed">•</Text>
            <Anchor href="#" target="_blank" color="dimmed" size="sm">
              Twitter
            </Anchor>
            <Text size="xs" color="dimmed">•</Text>
            <Anchor href="#" target="_blank" color="dimmed" size="sm">
              Instagram
            </Anchor>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}

export default Footer;