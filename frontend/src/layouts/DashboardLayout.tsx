/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Box,
  Flex,
  Icon,
  Text,
  IconButton,
  HStack,
  VStack,
  Separator,
  Avatar,
} from "@chakra-ui/react";
import { LuMenu, LuX, LuLogOut, LuBell } from "react-icons/lu";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ColorModeButton } from "../components/ui/color-mode";
import type { IconType } from "react-icons/lib";
import { useAppStore } from "@/app/store";

interface INavLink {
  icon: IconType;
  label: string;
  path: string;
}

const NavItem = ({
  icon,
  label,
  path,
  active,
}: {
  icon: IconType;
  label: string;
  path: string;
  active: boolean;
}) => (
  <Link to={path} style={{ width: "100%" }}>
    <HStack
      gap={4}
      px={4}
      py={3}
      borderRadius="lg"
      bg={active ? "blue.600" : "transparent"}
      color={active ? "white" : "fg.muted"}
      transition="all 0.2s"
      _hover={{
        bg: active ? "blue.600" : "bg.muted",
        color: active ? "white" : "blue.600",
      }}
      cursor="pointer"
      w="full"
    >
      <Icon as={icon} boxSize={5} />
      <Text fontWeight="medium">{label}</Text>
    </HStack>
  </Link>
);

export function DashboardLayout({ navLinks }: { navLinks: INavLink[] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const user = useAppStore((s) => s.user)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <Box minH="100vh" bg="bg.canvas" color="fg">
      {/* --- Sidebar for Desktop --- */}
      <Box
        as="nav"
        position="fixed"
        left="0"
        top="0"
        h="full"
        bg="bg.panel"
        w="280px"
        display={{ base: "none", lg: "block" }}
        zIndex="100"
        borderRight="1px solid"
        borderColor="border"
      >
        <VStack h="full" p={6} align="stretch" gap={8}>
          <Heading size="md" color="blue.600" px={2}>
            Rentify
          </Heading>

          <VStack align="stretch" gap={1} flex="1">
            {navLinks.map((link) => (
              <NavItem
                key={link.path}
                {...link}
                active={location.pathname === link.path}
              />
            ))}
          </VStack>

          <Separator borderColor="border" />

          <NavItem
            icon={LuLogOut}
            label="Logout"
            path="/login"
            active={false}
          />
        </VStack>
      </Box>

      {/* --- Mobile Sidebar Overlay --- */}
      {isMobileMenuOpen && (
        <Box
          position="fixed"
          inset="0"
          bg="blackAlpha.700"
          backdropFilter="blur(4px)"
          zIndex="200"
          onClick={toggleMobileMenu}
          display={{ lg: "none" }}
        />
      )}

      {/* --- Sidebar for Mobile --- */}
      <Box
        position="fixed"
        left={isMobileMenuOpen ? "0" : "-300px"}
        top="0"
        h="full"
        bg="bg.panel"
        w="280px"
        transition="left 0.3s ease"
        zIndex="201"
        display={{ lg: "none" }}
        borderRight="1px solid"
        borderColor="border"
      >
        <VStack h="full" p={6} align="stretch" gap={8}>
          <Flex justify="space-between" align="center">
            <Text fontWeight="bold" color="blue.600" fontSize="xl">
              Rentify
            </Text>
            <IconButton
              variant="ghost"
              onClick={toggleMobileMenu}
              aria-label="Close menu"
            >
              <LuX />
            </IconButton>
          </Flex>

          <VStack align="stretch" gap={2} flex="1">
            {navLinks.map((link) => (
              <NavItem
                key={link.path}
                {...link}
                active={location.pathname === link.path}
              />
            ))}
          </VStack>
        </VStack>
      </Box>

      {/* --- Main Content Area --- */}
      <Box ml={{ base: 0, lg: "280px" }} transition="margin 0.3s">
        {/* Top Navbar */}
        <Flex
          as="header"
          h="70px"
          bg="bg.panel"
          borderBottom="1px solid"
          borderColor="border"
          px={{ base: 4, md: 8 }}
          align="center"
          justify="space-between"
          position="sticky"
          top="0"
          zIndex="90"
        >
          <IconButton
            display={{ base: "flex", lg: "none" }}
            variant="ghost"
            onClick={toggleMobileMenu}
            aria-label="Open menu"
          >
            <LuMenu />
          </IconButton>

          <Text
            display={{ base: "none", md: "block" }}
            fontWeight="semibold"
            color="fg"
          >
            {navLinks.find((l) => l.path === location.pathname)?.label ||
              "Dashboard"}
          </Text>

          <HStack gap="1">
            {/* Color Mode Toggle */}
            <ColorModeButton />

            <IconButton
              variant="ghost"
              aria-label="Notifications"
              color="fg.subtle"
            >
              <LuBell />
            </IconButton>

            <Avatar.Root size="sm">
              <Avatar.Fallback name={user?.username} />
            </Avatar.Root>
          </HStack>
        </Flex>

        {/* Content Will Be Rendered Here */}
        <Box p={{ base: 3, md: 6 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

const Heading = ({ children, size, ...props }: any) => (
  <Text fontWeight="bold" fontSize={size === "md" ? "xl" : "2xl"} {...props}>
    {children}
  </Text>
);
