import { Box, Container, SimpleGrid, Heading, Text } from "@chakra-ui/react";
import { LuHandCoins, LuShieldCheck, LuZap } from "react-icons/lu";
import { MissionCard } from "./cards/MissionCard"

export function MissionSection() {
  const missions = [
    {
      icon: LuHandCoins,
      title: "Transparency",
      description: "No hidden fees. Every transaction is recorded on our digital ledger for complete peace of mind."
    },
    {
      icon: LuShieldCheck,
      title: "Security",
      description: "We verify every user and property. Your investments and your home are safe with us."
    },
    {
      icon: LuZap,
      title: "Efficiency",
      description: "From digital contracts to automated rent collection, we automate the boring stuff."
    }
  ];

  return (
    <Box as="section" py={16} bg="bg.info">
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
        {/* Header Content */}
        <Box maxW="3xl" mx="auto" textAlign="center" mb={12}>
          <Heading as="h2" size="xl" mb={6}>
            Our Mission
          </Heading>
          <Text fontSize="xl" lineHeight="relaxed" fontStyle="italic">
            "To empower property owners with effortless management solutions while providing 
            tenants with a safe, responsive, and modern living experience."
          </Text>
        </Box>

        {/* Mission Cards Grid */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
          {missions.map((item, index) => (
            <MissionCard 
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}