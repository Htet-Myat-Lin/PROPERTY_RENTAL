import { Box, Container, SimpleGrid, Heading, Text } from "@chakra-ui/react";
import leader1 from "@/assets/leader1.jpg";
import leader2 from "@/assets/leader2.jpg";
import leader3 from "@/assets/leader3.jpg";
import { TeamCard } from "./cards/TeamCard";

export function LeadershipSection() {
  const leaders = [
    {
      image: leader1,
      name: "James Anderson",
      role: "CEO & Founder",
      description: "Real estate veteran with 15+ years in commercial property development."
    },
    {
      image: leader2,
      name: "Sarah Jenkins",
      role: "Head of Operations",
      description: "Former property lawyer ensuring our contracts are rock solid."
    },
    {
      image: leader3,
      name: "Michael Chen",
      role: "Chief Technology Officer",
      description: "Tech wizard making sure the platform never sleeps."
    }
  ];

  return (
    <Box as="section" py={{ base: 16, md: 24 }} bg="bg">
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
        {/* Section Header */}
        <Box textAlign="center" mb={16}>
          <Heading as="h2" size={{ base: "xl", md: "2xl" }}>
            Meet the Leadership
          </Heading>
          <Text mt={4} color={{ base: "gray.600", _dark: "gray.200" }} maxW="2xl" mx="auto">
            The experts behind the platform, dedicated to your success.
          </Text>
        </Box>

        {/* Team Grid */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
          {leaders.map((leader, index) => (
            <TeamCard 
              key={index}
              image={leader.image}
              name={leader.name}
              role={leader.role}
              description={leader.description}
            />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}