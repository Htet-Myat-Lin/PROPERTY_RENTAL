import { Container, Heading } from "@chakra-ui/react";
import { PropertyCreateForm } from "../components/PropertyForm";

export function PropertyCreatePage() {
  return (
    <Container maxW="container.md" py={8}>
      <Heading mb={6}>Create New Property</Heading>
      <PropertyCreateForm />
    </Container>
  );
}
