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
  Badge,
} from "@chakra-ui/react";
import {
  LuMenu,
  LuX,
  LuLogOut,
  LuBell,
  LuSearch,
  LuChevronRight,
  LuHouse,
} from "react-icons/lu";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ColorModeButton } from "../components/ui/color-mode";
import type { IconType } from "react-icons/lib";
import { useAppStore } from "@/app/store";
import { useLogout } from "@/features/auth/hooks/useLogout";

interface INavLink {
  icon: IconType;
  label: string;
  path: string;
}

/* ─── Sidebar Nav Item ─── */
const NavItem = ({
  icon,
  label,
  path,
  active,
  collapsed,
}: {
  icon: IconType;
  label: string;
  path: string;
  active: boolean;
  collapsed?: boolean;
}) => (
  <Link to={path} style={{ width: "100%", textDecoration: "none" }}>
    <HStack
      gap={3}
      px={3}
      py={2.5}
      borderRadius="xl"
      bg={active ? "blue.50" : "transparent"}
      color={active ? "blue.600" : "fg.muted"}
      fontWeight={active ? "semibold" : "normal"}
      position="relative"
      transition="all 0.2s cubic-bezier(.4,0,.2,1)"
      _hover={{
        bg: active ? "blue.50" : "gray.100",
        color: active ? "blue.600" : "fg",
        transform: "translateX(2px)",
      }}
      _dark={{
        bg: active ? "blue.950" : "transparent",
        color: active ? "blue.200" : "fg.muted",
        _hover: {
          bg: active ? "blue.950" : "whiteAlpha.100",
          color: active ? "blue.200" : "fg",
        },
      }}
      cursor="pointer"
      w="full"
    >
      {/* Active indicator bar */}
      {active && (
        <Box
          position="absolute"
          left="-12px"
          top="50%"
          transform="translateY(-50%)"
          w="4px"
          h="60%"
          bg="blue.500"
          borderRadius="full"
        />
      )}
      <Flex
        align="center"
        justify="center"
        w="36px"
        h="36px"
        borderRadius="lg"
        bg={active ? "blue.500" : "transparent"}
        color={active ? "white" : "inherit"}
        transition="all 0.2s"
        flexShrink={0}
      >
        <Icon as={icon} boxSize={5} />
      </Flex>
      {!collapsed && (
        <Text fontSize="sm" lineClamp={1}>
          {label}
        </Text>
      )}
      {active && !collapsed && (
        <Icon as={LuChevronRight} boxSize={4} ml="auto" opacity={0.5} />
      )}
    </HStack>
  </Link>
);

/* ─── Sidebar Brand / Logo ─── */
const SidebarBrand = () => (
  <HStack gap={3} px={1} py={2}>
    <Flex
      align="center"
      justify="center"
      w="40px"
      h="40px"
      borderRadius="xl"
      bg="blue.500"
      color="white"
      fontWeight="bold"
      fontSize="lg"
      flexShrink={0}
    >
      <Icon as={LuHouse} boxSize={5} />
    </Flex>
    <VStack gap={0} align="start">
      <Text fontWeight="bold" fontSize="lg" lineHeight="1.2" color="fg">
        Rentify
      </Text>
      <Text fontSize="xs" color="fg.muted" lineHeight="1">
        Property Manager
      </Text>
    </VStack>
  </HStack>
);

/* ─── Sidebar User Profile ─── */
const SidebarUserProfile = ({
  user,
  onLogout,
}: {
  user: any;
  onLogout: () => void;
}) => (
  <Box>
    <Separator borderColor="border.muted" mb={4} />
    <Flex
      align="center"
      gap={3}
      p={3}
      borderRadius="xl"
      bg="bg.subtle"
      _dark={{ bg: "whiteAlpha.50" }}
    >
      <Avatar.Root size="sm">
        <Avatar.Fallback
          name={user?.username}
          bg="blue.500"
          color="white"
          fontWeight="semibold"
        />
      </Avatar.Root>
      <VStack gap={0} align="start" flex={1} overflow="hidden">
        <Text fontSize="sm" fontWeight="semibold" lineClamp={1} color="fg">
          {user?.username || "User"}
        </Text>
        <Text fontSize="xs" color="fg.muted" lineClamp={1}>
          {user?.role || "Member"}
        </Text>
      </VStack>
      <IconButton
        variant="ghost"
        size="sm"
        aria-label="Logout"
        color="fg.muted"
        _hover={{ color: "red.500", bg: "red.50" }}
        _dark={{ _hover: { bg: "red.950" } }}
        onClick={onLogout}
        borderRadius="lg"
      >
        <LuLogOut />
      </IconButton>
    </Flex>
  </Box>
);

/* ─── Desktop Sidebar Content ─── */
const SidebarContent = ({
  navLinks,
  location,
  user,
  onLogout,
}: {
  navLinks: INavLink[];
  location: any;
  user: any;
  onLogout: () => void;
}) => (
  <VStack h="full" p={5} align="stretch" gap={6}>
    {/* Brand */}
    <SidebarBrand />

    <Separator borderColor="border.muted" />

    {/* Navigation Label */}
    <Box>
      <Text
        fontSize="xs"
        fontWeight="bold"
        textTransform="uppercase"
        letterSpacing="wider"
        color="fg.muted"
        mb={3}
        px={3}
      >
        Menu
      </Text>
      <VStack align="stretch" gap={1} flex="1">
        {navLinks.map((link) => (
          <NavItem
            key={link.path}
            {...link}
            active={location.pathname === link.path}
          />
        ))}
      </VStack>
    </Box>

    {/* Spacer */}
    <Box flex={1} />

    {/* User Profile */}
    <SidebarUserProfile user={user} onLogout={onLogout} />
  </VStack>
);

/* ─── Main Layout ─── */
export function DashboardLayout({ navLinks }: { navLinks: INavLink[] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const user = useAppStore((s) => s.user);
  const logout = useLogout();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <Box minH="100vh" bg="bg.canvas" color="fg">
      {/* ─── Desktop Sidebar ─── */}
      <Box
        as="nav"
        position="fixed"
        left="0"
        top="0"
        h="full"
        bg="bg.panel"
        w="270px"
        display={{ base: "none", lg: "block" }}
        zIndex="100"
        borderRight="1px solid"
        borderColor="border.muted"
        boxShadow="sm"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: "var(--chakra-colors-border)",
            borderRadius: "full",
          },
        }}
      >
        <SidebarContent
          navLinks={navLinks}
          location={location}
          user={user}
          onLogout={handleLogout}
        />
      </Box>

      {/* ─── Mobile Sidebar Overlay ─── */}
      {isMobileMenuOpen && (
        <Box
          position="fixed"
          inset="0"
          bg="blackAlpha.600"
          backdropFilter="blur(8px)"
          zIndex="200"
          onClick={toggleMobileMenu}
          display={{ lg: "none" }}
          transition="opacity 0.3s"
        />
      )}

      {/* ─── Mobile Sidebar ─── */}
      <Box
        position="fixed"
        left={isMobileMenuOpen ? "0" : "-300px"}
        top="0"
        h="full"
        bg="bg.panel"
        w="270px"
        transition="left 0.3s cubic-bezier(.4,0,.2,1)"
        zIndex="201"
        display={{ lg: "none" }}
        boxShadow={isMobileMenuOpen ? "2xl" : "none"}
        overflowY="auto"
      >
        <VStack h="full" p={5} align="stretch" gap={6}>
          {/* Mobile Header */}
          <Flex justify="space-between" align="center">
            <SidebarBrand />
            <IconButton
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              aria-label="Close menu"
              borderRadius="lg"
            >
              <LuX />
            </IconButton>
          </Flex>

          <Separator borderColor="border.muted" />

          {/* Navigation */}
          <Box>
            <Text
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
              color="fg.muted"
              mb={3}
              px={3}
            >
              Menu
            </Text>
            <VStack align="stretch" gap={1} flex="1">
              {navLinks.map((link) => (
                <NavItem
                  key={link.path}
                  {...link}
                  active={location.pathname === link.path}
                />
              ))}
            </VStack>
          </Box>

          <Box flex={1} />

          {/* User Profile */}
          <SidebarUserProfile user={user} onLogout={handleLogout} />
        </VStack>
      </Box>

      {/* ─── Main Content Area ─── */}
      <Box ml={{ base: 0, lg: "270px" }} transition="margin 0.3s">
        {/* ─── Top Navbar ─── */}
        <Flex
          as="header"
          h="64px"
          bg="bg.panel/80"
          backdropFilter="blur(12px)"
          borderBottom="1px solid"
          borderColor="border.muted"
          px={{ base: 4, md: 8 }}
          align="center"
          justify="space-between"
          position="sticky"
          top="0"
          zIndex="90"
        >
          {/* Left side */}
          <HStack gap={3}>
            <IconButton
              display={{ base: "flex", lg: "none" }}
              variant="ghost"
              onClick={toggleMobileMenu}
              aria-label="Open menu"
              size="sm"
              borderRadius="lg"
            >
              <LuMenu />
            </IconButton>

            {/* Search bar (desktop) */}
            <HStack
              display={{ base: "none", md: "flex" }}
              bg="bg.subtle"
              _dark={{ bg: "whiteAlpha.50" }}
              borderRadius="xl"
              px={4}
              py={2}
              gap={2}
              minW="280px"
              cursor="pointer"
              border="1px solid"
              borderColor="transparent"
              transition="all 0.2s"
              _hover={{ borderColor: "border" }}
            >
              <Icon as={LuSearch} boxSize={4} color="fg.muted" />
              <Text fontSize="sm" color="fg.muted">
                Search...
              </Text>
              <Box ml="auto">
                <Text
                  fontSize="xs"
                  color="fg.muted"
                  bg="bg.panel"
                  px={2}
                  py={0.5}
                  borderRadius="md"
                  border="1px solid"
                  borderColor="border.muted"
                  fontFamily="mono"
                >
                  ⌘K
                </Text>
              </Box>
            </HStack>
          </HStack>

          {/* Right side */}
          <HStack gap={1}>
            {/* Search icon for mobile */}
            <IconButton
              display={{ base: "flex", md: "none" }}
              variant="ghost"
              aria-label="Search"
              size="sm"
              borderRadius="lg"
              color="fg.muted"
            >
              <LuSearch />
            </IconButton>

            <ColorModeButton />

            {/* Notification bell with badge */}
            <Box position="relative">
              <IconButton
                variant="ghost"
                aria-label="Notifications"
                color="fg.muted"
                size="sm"
                borderRadius="lg"
                _hover={{ color: "fg" }}
              >
                <LuBell />
              </IconButton>
              <Badge
                position="absolute"
                top="1"
                right="1"
                size="xs"
                colorPalette="red"
                variant="solid"
                borderRadius="full"
                minW="16px"
                h="16px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="2xs"
              >
                3
              </Badge>
            </Box>

            {/* User avatar with name */}
            <HStack
              gap={2}
              ml={2}
              pl={3}
              borderLeft="1px solid"
              borderColor="border.muted"
              display={{ base: "none", md: "flex" }}
            >
              <VStack gap={0} align="end">
                <Text fontSize="sm" fontWeight="semibold" lineHeight="1.2">
                  {user?.username || "User"}
                </Text>
                <Text fontSize="xs" color="fg.muted" lineHeight="1.2">
                  {user?.role || "Member"}
                </Text>
              </VStack>
              <Avatar.Root size="sm">
                <Avatar.Fallback
                  name={user?.username}
                  bg="blue.500"
                  color="white"
                  fontWeight="semibold"
                />
              </Avatar.Root>
            </HStack>

            {/* Mobile avatar only */}
            <Box display={{ base: "block", md: "none" }}>
              <Avatar.Root size="sm">
                <Avatar.Fallback
                  name={user?.username}
                  bg="blue.500"
                  color="white"
                  fontWeight="semibold"
                />
              </Avatar.Root>
            </Box>
          </HStack>
        </Flex>

        {/* ─── Page Content ─── */}
        <Box
          p={{ base: 4, md: 6, lg: 8 }}
          maxW="1400px"
          mx="auto"
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
