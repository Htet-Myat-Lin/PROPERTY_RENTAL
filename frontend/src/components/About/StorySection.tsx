import {
  Box,
  Container,
  SimpleGrid,
  Image,
  Heading,
  Text,
  Stack,
  Flex,
} from "@chakra-ui/react";
import team from "@/assets/team.jpg";

export function StorySection() {
  return (
    <Box as="section" py={{ base: "16", md: "24" }} bg="bg">
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={12} alignItems="center">
          
          {/* Image Side */}
          <Box 
            position="relative" 
            borderRadius="2xl" 
            overflow="hidden" 
            shadow="xl"
          >
            <Image
              src={team}
              alt="Diverse Real Estate Team Working Together"
              w="full"
              h="full"
              objectFit="cover"
              transition="transform 0.5s"
              _hover={{ transform: "scale(1.05)" }}
            />
          </Box>

          {/* Content Side */}
          <Box>
            <Text
              color="blue.600"
              fontWeight="semibold"
              letterSpacing="wide"
              textTransform="uppercase"
              fontSize="sm"
              mb={2}
            >
              Our Story
            </Text>
            
            <Heading
              as="h3"
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              mb={6}
              color={{ base: "gray.800" , _dark:"gray.300" }}
            >
              Building Trust Since 2015
            </Heading>

            <Stack gap={6} mb={8} color={{ base: "gray.700" , _dark:"gray.400" }}>
              <Text fontSize="lg" lineHeight="relaxed">
                Started by a group of real estate enthusiasts, EstatePro was born from a 
                simple frustration: the disconnect between landlords and tenants. We saw 
                an industry stuck in the past—endless paperwork, hidden fees, and poor communication.
              </Text>
              <Text fontSize="lg" lineHeight="relaxed">
                Today, we manage over $500M in assets across the country. Our platform uses 
                cutting-edge technology to ensure owners get paid on time and tenants love 
                where they live. We believe that a happy tenant is the best asset a landlord can have.
              </Text>
            </Stack>

            {/* Stats Row */}
            <Flex 
              gap={8} 
              borderTop="1px solid" 
              borderColor="gray.100" 
              pt={8}
              direction={{ base: "column", sm: "row" }}
            >
              <Box>
                <Text as="span" display="block" fontSize="3xl" fontWeight="bold" color="blue.600">
                  2k+
                </Text>
                <Text color="gray.500" fontSize="sm">
                  Properties Managed
                </Text>
              </Box>
              
              <Box>
                <Text as="span" display="block" fontSize="3xl" fontWeight="bold" color="blue.600">
                  98%
                </Text>
                <Text color="gray.500" fontSize="sm">
                  Occupancy Rate
                </Text>
              </Box>
              
              <Box>
                <Text as="span" display="block" fontSize="3xl" fontWeight="bold" color="blue.600">
                  5yr
                </Text>
                <Text color="gray.500" fontSize="sm">
                  Avg. Tenancy
                </Text>
              </Box>
            </Flex>
          </Box>
          
        </SimpleGrid>
      </Container>
    </Box>
  );
}