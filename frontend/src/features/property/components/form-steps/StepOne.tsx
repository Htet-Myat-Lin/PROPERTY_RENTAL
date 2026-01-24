import {
  Box,
  Field,
  Flex,
  Input,
  NumberInput,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import type { PropertyFormValues } from "../../schema";

export function StepOne() {
  const { register, formState: {errors} } = useFormContext<PropertyFormValues>()

  return (
    <Box my="5">
      <Stack gap="5">
        {/* Title Field */}
        <Field.Root invalid={!!errors.title}>
          <Field.Label>Title</Field.Label>
          <Input type="text" placeholder="Enter property title" {...register("title")} />
          <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
        </Field.Root>

        {/* Description */}
        <Field.Root invalid={!!errors.description}>
          <Field.Label>Description</Field.Label>
          <Textarea rows={4} placeholder="Enter description" {...register("description")} />
          <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
        </Field.Root>

        {/* Bed and Bath rooms */}
        <Flex align="center" justify="space-between" gap="1">
          <Field.Root invalid={!!errors.beds}>
            <Field.Label>Bedroom</Field.Label>
            <NumberInput.Root defaultValue="0" min={0}>
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
              <NumberInput.Input {...register("beds")} />
            </NumberInput.Root>
            <Field.ErrorText>{errors.beds?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.baths}>
            <Field.Label>Bathroom</Field.Label>
            <NumberInput.Root defaultValue="0" min={0}>
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
              <NumberInput.Input {...register("baths")} />
            </NumberInput.Root>
            <Field.ErrorText>{errors.baths?.message}</Field.ErrorText>
          </Field.Root>
        </Flex>

        {/* Rent Price & Area */}
        <Flex align="center" justify="space-between" gap="1">
          <Field.Root invalid={!!errors.rentPrice}>
            <Field.Label>Rent Price (per month)</Field.Label>
            <NumberInput.Root defaultValue="0" min={0}>
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
              <NumberInput.Input {...register("rentPrice")} />
            </NumberInput.Root>
            <Field.ErrorText>{errors.rentPrice?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.area}>
            <Field.Label>Area (sqft)</Field.Label>
            <NumberInput.Root defaultValue="0" min={0}>
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
              <NumberInput.Input {...register("area")} />
            </NumberInput.Root>
            <Field.ErrorText>{errors.area?.message}</Field.ErrorText>
          </Field.Root>
        </Flex>
      </Stack>
    </Box>
  );
}
