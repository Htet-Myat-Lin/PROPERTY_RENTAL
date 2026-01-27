import {
  Box,
  Field,
  Flex,
  Input,
  NumberInput,
  Stack,
  Textarea,
  Select,
  Portal,
  createListCollection,
} from "@chakra-ui/react";
import { useFormContext, Controller } from "react-hook-form";
import type { PropertyFormValues } from "../../schema";

const petOptions = createListCollection({
  items: [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
  ],
});

export function StepOne() {
  const { register, formState: {errors}, control } = useFormContext<PropertyFormValues>()

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
          <Field.Root invalid={!!errors.baseRentPrice}>
            <Field.Label>Rent Price (per month)</Field.Label>
            <NumberInput.Root defaultValue="0" min={0}>
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
              <NumberInput.Input {...register("baseRentPrice")} />
            </NumberInput.Root>
            <Field.ErrorText>{errors.baseRentPrice?.message}</Field.ErrorText>
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

        {/* Parking Spaces & Year Built */}
        <Flex align="center" justify="space-between" gap="1">
          <Field.Root invalid={!!errors.parkingSpaces}>
            <Field.Label>Parking Spaces</Field.Label>
            <NumberInput.Root defaultValue="0" min={0}>
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
              <NumberInput.Input {...register("parkingSpaces")} />
            </NumberInput.Root>
            <Field.ErrorText>{errors.parkingSpaces?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.yearBuilt && !!errors.yearBuilt.message}>
            <Field.Label>Year Built (Optional)</Field.Label>
            <Input 
              type="number"
              min={1800}
              max={new Date().getFullYear()}
              placeholder="e.g., 2020"
              {...register("yearBuilt", {
                setValueAs: (v) => {
                  if (v === "" || v === null || v === undefined || v === "0" || Number(v) === 0) {
                    return undefined;
                  }
                  const num = Number(v);
                  return isNaN(num) ? undefined : num;
                },
                validate: (value) => {
                  if (value === undefined || value === null) return true; // Optional field
                  if (value < 1800) return "Year must be 1800 or later";
                  if (value > new Date().getFullYear()) return `Year cannot be later than ${new Date().getFullYear()}`;
                  return true;
                }
              })}
            />
            <Field.ErrorText>{errors.yearBuilt?.message}</Field.ErrorText>
          </Field.Root>
        </Flex>

        {/* Pet Allowed & Available Date */}
        <Flex align="center" justify="space-between" gap="1">
          <Field.Root invalid={!!errors.petAllowed}>
            <Field.Label>Pet Allowed</Field.Label>
            <Controller
              name="petAllowed"
              control={control}
              render={({ field }) => {
                const value = field.value ? "true" : "false";
                return (
                  <Select.Root
                    collection={petOptions}
                    size="md"
                    width="full"
                    value={[value]}
                    onValueChange={(details) => {
                      field.onChange(details.value[0] === "true");
                    }}
                    onBlur={field.onBlur}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select option" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {petOptions.items.map((item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                );
              }}
            />
            <Field.ErrorText>{errors.petAllowed?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.availableDate}>
            <Field.Label>Available Date</Field.Label>
            <Input 
              type="date" 
              {...register("availableDate")} 
            />
            <Field.ErrorText>{errors.availableDate?.message}</Field.ErrorText>
          </Field.Root>
        </Flex>
      </Stack>
    </Box>
  );
}
