'use client';

import { AppShell, Burger, Group, Menu, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export default function Home() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text>SIGAIDA Campus Energy</Text>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Menu>
          <Menu.Item>Test</Menu.Item>
        </Menu>
      </AppShell.Navbar>
      <AppShell.Main>
        <Text>This is the main section, your app content here.</Text>
        <Text>Layout used in most cases – Navbar and Header with fixed position</Text>
      </AppShell.Main>
    </AppShell>
  );
}