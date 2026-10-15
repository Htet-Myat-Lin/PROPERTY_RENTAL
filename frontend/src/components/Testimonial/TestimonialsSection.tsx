import { Box, Container, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import leader1 from "@/assets/leader1.jpg";
import leader2 from "@/assets/leader2.jpg";
import leader3 from "@/assets/leader3.jpg";
import { TestimonialCard, type Testimonial } from "./cards/TestimonialCard";

export function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      name: "Aung Myo",
      role: "Tenant, Yangon",
      avatar: leader1,
      rating: 5,
      quote:
        "Finding a verified apartment used to take weeks. I found and secured my place in just three days without a single site visit.",
    },
    {
      name: "Sarah Jenkins",
      role: "Landlord",
      avatar: leader2,
      rating: 5,
      quote:
        "Managing tenants and rent used to be a headache. Now I track everything from one dashboard and get paid on time, every time.",
    },
    {
      name: "Michael Chen",
      role: "Tenant, Mandalay",
      avatar: leader3,
      rating: 4,
      quote:
        "Transparent pricing and no hidden fees. The escrow process gave me real peace of mind before moving in.",
    },
    {
      name: "Thiri Aung",
      role: "Property Owner",
      rating: 5,
      quote:
        "Listing my property took minutes and the quality of enquiries was far better than anywhere else I've tried.",
    },
    {
      name: "David Miller",
      role: "Tenant, Naypyidaw",
      rating: 5,
      quote:
        "The support team resolved my lease question the same day. It genuinely feels like they care about renters.",
    },
    {
      name: "Khin Su",
      role: "Landlord",
      rating: 4,
      quote:
        "Rent reminders and digital contracts saved me hours every month. Highly recommended for independent owners.",
    },
  ];

  return (
    <Box as="section" py={{ base: 16, md: 24 }} bg="bg">
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
        <Box textAlign="center" mb={16}>
          <Heading as="h2" size={{ base: "xl", md: "2xl" }}>
            Loved by Renters & Owners
          </Heading>
          <Text
            mt={4}
            color="fg.muted"
            maxW="2xl"
            mx="auto"
          >
            Real experiences from people who found, listed, and managed their
            homes with us.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
