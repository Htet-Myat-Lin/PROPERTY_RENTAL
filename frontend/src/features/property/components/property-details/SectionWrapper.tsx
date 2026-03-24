import { Box, Heading, Separator } from "@chakra-ui/react";

export function SectionWrapper({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="2xl"
      p="5"
      bg="white"
      _dark={{ bg: "gray.900" }}
      shadow="sm"
    >
      {title && (
        <>
          <Heading size="md" mb="4" letterSpacing="tight">
            {title}
          </Heading>
          <Separator mb="4" />
        </>
      )}
      {children}
    </Box>
  );
}