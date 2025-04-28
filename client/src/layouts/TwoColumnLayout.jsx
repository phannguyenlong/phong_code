import { Container, Grid } from '@mantine/core';

function TwoColumnLayout({ sidebar, main }) {
  return (
    <Container size="xl" px="md">
      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          {sidebar}
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9 }}>
          {main}
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default TwoColumnLayout;