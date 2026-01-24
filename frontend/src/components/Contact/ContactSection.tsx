import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Stack,
  VStack,
  Input,
  Textarea,
  Button,
  Flex,
} from "@chakra-ui/react";
import { LuPhone, LuMail, LuMapPin, LuClock} from "react-icons/lu";
import { ContactInfo } from "./ContactInfo";

export function ContactSection() {
  return (
    <Box minH="100vh">
      {/* 1. Header Section */}
      <Box bg="bg.info" py={{ base: 16, md: 24 }}>
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>Get in Touch</Heading>
          <Text fontSize="xl" maxW="2xl" mx="auto">
            Have questions about property management or finding your next home? 
            Our team is here to help you every step of the way.
          </Text>
        </Container>
      </Box>

      {/* 2. Main Contact Section */}
      <Container maxW="7xl" py={20} px={{ base: 4, sm: 6, lg: 8 }} mt="-10">
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={16}>
          
          {/* Left Side: Contact Form */}
          <Box bg="bg.muted" p={{ base: 8, md: 10 }} borderRadius="2xl" shadow="2xl">
            <VStack gap={6} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                <Stack gap={2}>
                  <Text fontWeight="medium" fontSize="sm">First Name</Text>
                  <Input colorPalette="blue" placeholder="John" />
                </Stack>
                <Stack gap={2}>
                  <Text fontWeight="medium" fontSize="sm">Last Name</Text>
                  <Input colorPalette="blue" placeholder="Doe" />
                </Stack>
              </SimpleGrid>

              <Stack gap={2}>
                <Text fontWeight="medium" fontSize="sm">Email Address</Text>
                <Input colorPalette="blue" type="email" placeholder="john@example.com" />
              </Stack>

              <Stack gap={2}>
                <Text fontWeight="medium" fontSize="sm">Subject</Text>
                <Input colorPalette="blue" placeholder="How can we help?" />
              </Stack>

              <Stack gap={2}>
                <Text fontWeight="medium" fontSize="sm">Message</Text>
                <Textarea 
                  colorPalette="blue"
                  placeholder="Tell us more about your inquiry..." 
                  size="lg" 
                  rows={5}
                />
              </Stack>

              <Button 
                colorPalette="blue"
                size="lg" 
                h="14" 
                fontSize="md" 
                fontWeight="bold"
              >
                Send Message
              </Button>
            </VStack>
          </Box>

          {/* Right Side: Contact Info & Map */}
          <VStack align="flex-start" gap={10} py={4}>
            <VStack align="flex-start" gap={6}>
              <Heading size="lg">Contact Information</Heading>
              <Text color={{ base: "gray.800", _dark: "gray.400" }} fontSize="lg">
                Prefer a direct conversation? Reach out via phone or email, or visit our 
                headquarters in the heart of the city.
              </Text>
            </VStack>

            <VStack align="flex-start" gap={8} w="full">
              <ContactInfo 
                icon={LuPhone} 
                title="Phone" 
                detail="+1 (555) 000-0000" 
              />
              <ContactInfo 
                icon={LuMail} 
                title="Email" 
                detail="support@estatepro.com" 
              />
              <ContactInfo 
                icon={LuMapPin} 
                title="Office" 
                detail="123 Business Ave, Suite 100, San Francisco, CA" 
              />
              <ContactInfo 
                icon={LuClock} 
                title="Working Hours" 
                detail="Mon-Fri: 9am - 6pm" 
              />
            </VStack>

            {/* Social Links or Google Map Placeholder */}
            <Box w="full" h="200px" bg="gray.100" borderRadius="2xl" overflow="hidden" position="relative">
               {/* In a real app, you would embed a Google Map iframe here */}
               <Flex align="center" justify="center" h="full">
                  <Text color="gray.400" fontWeight="medium">Google Maps Integration</Text>
               </Flex>
            </Box>
          </VStack>

        </SimpleGrid>
      </Container>
    </Box>
  );
}