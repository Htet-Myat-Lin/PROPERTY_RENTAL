import { Header } from "@/components/Header/Header";
import { Listings } from "@/features/property/components/Listings";
import { Box } from "@chakra-ui/react";

export function PropertyListingPage() {
  return (
    <>
      <Header />
      <Box
        bg="bg.subtle"
        px={{ base: "2", md: "4" }}
        py={{ base: "12", md: "20" }}
      >
        <Box
          mx="auto"
          maxW="7xl"
        >
          <Listings />
        </Box>
      </Box>
    </>
  );
}
