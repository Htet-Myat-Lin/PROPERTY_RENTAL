import { SectionWrapper } from "./SectionWrapper";
import { Text } from "@chakra-ui/react"

export function PropertyDescription({ description } : { description: string }) {
  return (
    <SectionWrapper title="Description">
      <Text
        fontSize="sm"
        color="fg.muted"
        lineHeight="tall"
        textAlign="justify"
      >
        {description}
      </Text>
    </SectionWrapper>
  );
}
