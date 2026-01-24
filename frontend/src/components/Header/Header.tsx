import {
  Avatar,
  Box,
  Button,
  CloseButton,
  Drawer,
  Flex,
  For,
  HStack,
  Icon,
  Menu,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaHouseDamage } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router";
import { ColorModeButton } from "../ui/color-mode";
import { LuMenu } from "react-icons/lu";
import { useAppStore } from "@/app/store";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { toast } from "react-toastify";

const navRoutes = [
  { label: "Home", route: "/" },
  { label: "Properties", route: "/properties" },
  { label: "About", route: "/about" },
  { label: "Contact", route: "/contact" },
  { label: "Testimonial", route: "/testimonial" },
];

function LogoSection() {
  return (
    <HStack gap="1">
      <Icon size="lg" color="blue.600">
        <FaHouseDamage />
      </Icon>
      <Text fontWeight="bold" fontSize="lg">
        Rentify
      </Text>
    </HStack>
  );
}

function DisplayNavLinks() {
  return (
    <For each={navRoutes}>
      {(route, i) => (
        <Text
          key={i}
          asChild
          _currentPage={{
            color: "blue.500",
            fontWeight: "bold",
            borderBottom: { base: "none", md: "solid 2px" },
            borderLeft: { base: "solid 4px", md: "none" },
            paddingLeft: { base: "3", md: "0" },
            bg: { base: "blue.50/10", md: "transparent" },
          }}
          _hover={{ textDecoration: "none", color: "blue.600" }}
          display="block"
          py="2"
        >
          <NavLink to={route.route}>
            <Text fontSize="sm">{route.label}</Text>
          </NavLink>
        </Text>
      )}
    </For>
  );
}

export function Header() {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const { mutate } = useLogout();

  const handleLogout = async () => {
    mutate();
    toast.success("Logout was successful.");
    navigate("/login-register");
  };

  return (
    <Box bg="bg.info" px="4" position="sticky" top="0" zIndex="docked">
      <Flex
        maxW="7xl"
        mx="auto"
        alignItems="center"
        justify="space-between"
        h="60px"
      >
        {/* Logo & Title */}
        <LogoSection />

        {/* Desktop Links - Hidden on Mobile */}
        <HStack gap="6" display={{ base: "none", md: "flex" }}>
          <DisplayNavLinks />
        </HStack>

        {/* Right End of Header */}
        <HStack gap="0.5">
          {/* Dark Mode Toggle Button */}
          <ColorModeButton />

          {/* Mobile View */}
          <Drawer.Root placement="start">
            <Drawer.Trigger>
              <Icon
                size="lg"
                display={{ base: "block", md: "none" }}
                marginEnd="1"
              >
                <LuMenu />
              </Icon>
            </Drawer.Trigger>
            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content>
                  <Drawer.Header>
                    <Drawer.Title>
                      <LogoSection />
                    </Drawer.Title>
                  </Drawer.Header>
                  <Drawer.Body>
                    <Stack gap="4" marginEnd="auto">
                      <DisplayNavLinks />
                    </Stack>
                  </Drawer.Body>
                  <Drawer.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Drawer.CloseTrigger>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>

          {/* Right End of Navbar */}
          {user ? (
            <Menu.Root>
              <Menu.Trigger rounded="full" focusRing="outside">
                <Avatar.Root size="sm">
                  <Avatar.Fallback name={user.username} />
                </Avatar.Root>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="account">Account</Menu.Item>
                    <Menu.Item value="settings">Settings</Menu.Item>
                    <Menu.Item onClick={() => handleLogout()} value="logout">
                      Logout
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          ) : (
            <Button
              onClick={() => navigate("/login-register")}
              colorPalette="blue"
            >
              Login
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}
