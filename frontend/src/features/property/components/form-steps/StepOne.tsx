import {
  Box,
  Field,
  Input,
  NumberInput,
  Stack,
  Textarea,
  Select,
  Portal,
  createListCollection,
  Text,
  Icon,
  Grid,
} from "@chakra-ui/react";
import { useFormContext, Controller } from "react-hook-form";
import type { PropertyFormValues } from "../../schema";
import { LuDollarSign, LuRuler, LuCar, LuCalendar } from "react-icons/lu";

const petOptions = createListCollection({
  items: [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
  ],
});

export function StepOne() {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<PropertyFormValues>();

  return (
    <Box my="2">
      <Stack gap={6}>
        {/* Title Field */}
        <Field.Root invalid={!!errors.title}>
          <Field.Label fontWeight="semibold" mb={1}>
            Property Title <Text as="span" color="red.500">*</Text>
          </Field.Label>
          <Input
            type="text"
            placeholder="e.g., Modern Downtown Apartment"
            {...register("title")}
            borderRadius="lg"
            size="md"
          />
          <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
        </Field.Root>

        {/* Description */}
        <Field.Root invalid={!!errors.description}>
          <Field.Label fontWeight="semibold" mb={1}>
            Description <Text as="span" color="red.500">*</Text>
          </Field.Label>
          <Textarea
            rows={4}
            placeholder="Describe your property features and amenities..."
            {...register("description")}
            borderRadius="lg"
            size="md"
          />
          <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
        </Field.Root>

        {/* Property Stats Grid */}
        <Box 
          p={4} 
          bg="bg.subtle" 
          _dark={{ bg: "whiteAlpha.50" }}
          borderRadius="xl"
        >
          <Text fontSize="sm" fontWeight="semibold" color="fg.muted" mb={3}>
            Property Details
          </Text>
          
          <Grid templateColumns={{ base: "1fr 1fr", md: "repeat(4, 1fr)" }} gap={4}>
            {/* Bedrooms */}
            <Field.Root invalid={!!errors.beds}>
              <Field.Label fontSize="sm">Bedrooms</Field.Label>
              <NumberInput.Root defaultValue="0" min={0} size="sm">
                <NumberInput.Control borderRadius="lg">
                  <NumberInput.IncrementTrigger />
                  <NumberInput.DecrementTrigger />
                </NumberInput.Control>
                <NumberInput.Input {...register("beds")} />
              </NumberInput.Root>
              <Field.ErrorText>{errors.beds?.message}</Field.ErrorText>
            </Field.Root>

            {/* Bathrooms */}
            <Field.Root invalid={!!errors.baths}>
              <Field.Label fontSize="sm">Bathrooms</Field.Label>
              <NumberInput.Root defaultValue="0" min={0} size="sm">
                <NumberInput.Control borderRadius="lg">
                  <NumberInput.IncrementTrigger />
                  <NumberInput.DecrementTrigger />
                </NumberInput.Control>
                <NumberInput.Input {...register("baths")} />
              </NumberInput.Root>
              <Field.ErrorText>{errors.baths?.message}</Field.ErrorText>
            </Field.Root>

            {/* Parking */}
            <Field.Root invalid={!!errors.parkingSpaces}>
              <Field.Label fontSize="sm">
                <Icon as={LuCar} boxSize={3} mr={1} /> Parking
              </Field.Label>
              <NumberInput.Root defaultValue="0" min={0} size="sm">
                <NumberInput.Control borderRadius="lg">
                  <NumberInput.IncrementTrigger />
                  <NumberInput.DecrementTrigger />
                </NumberInput.Control>
                <NumberInput.Input {...register("parkingSpaces")} />
              </NumberInput.Root>
              <Field.ErrorText>{errors.parkingSpaces?.message}</Field.ErrorText>
            </Field.Root>

            {/* Year Built */}
            <Field.Root invalid={!!errors.yearBuilt}>
              <Field.Label fontSize="sm">Year Built</Field.Label>
              <NumberInput.Root defaultValue="2010" min={1900} size="sm">
                <NumberInput.Control borderRadius="lg">
                  <NumberInput.IncrementTrigger />
                  <NumberInput.DecrementTrigger />
                </NumberInput.Control>
                <NumberInput.Input {...register("yearBuilt")} />
              </NumberInput.Root>
              <Field.ErrorText>{errors.yearBuilt?.message}</Field.ErrorText>
            </Field.Root>
          </Grid>
        </Box>

        {/* Rent & Area - Side by Side */}
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
          <Field.Root invalid={!!errors.baseRentPrice}>
            <Field.Label fontWeight="semibold" mb={1}>
              <Icon as={LuDollarSign} boxSize={4} mr={1} color="green.500" />
              Monthly Rent <Text as="span" color="red.500">*</Text>
            </Field.Label>
            <NumberInput.Root defaultValue="0" min={0} size="lg">
              <NumberInput.Control borderRadius="lg">
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
              <NumberInput.Input {...register("baseRentPrice")} />
            </NumberInput.Root>
            <Field.ErrorText>{errors.baseRentPrice?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.area}>
            <Field.Label fontWeight="semibold" mb={1}>
              <Icon as={LuRuler} boxSize={4} mr={1} color="blue.500" />
              Area (sqft) <Text as="span" color="red.500">*</Text>
            </Field.Label>
            <NumberInput.Root defaultValue="0" min={0} size="lg">
              <NumberInput.Control borderRadius="lg">
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
              <NumberInput.Input {...register("area")} />
            </NumberInput.Root>
            <Field.ErrorText>{errors.area?.message}</Field.ErrorText>
          </Field.Root>
        </Grid>

        {/* Pet & Availability */}
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
          <Field.Root invalid={!!errors.petAllowed}>
            <Field.Label fontWeight="semibold" mb={1}>
              <Icon as={LuCalendar} boxSize={4} mr={1} color="purple.500" />
              Pet Friendly
            </Field.Label>
            <Controller
              name="petAllowed"
              control={control}
              render={({ field }) => {
                const value = field.value ? "true" : "false";
                return (
                  <Select.Root
                    collection={petOptions}
                    size="lg"
                    width="full"
                    value={[value]}
                    onValueChange={(details) => {
                      field.onChange(details.value[0] === "true");
                    }}
                    onBlur={field.onBlur}
                  >
                    <Select.HiddenSelect />
                    <Select.Control borderRadius="lg">
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
            <Field.Label fontWeight="semibold" mb={1}>
              <Icon as={LuCalendar} boxSize={4} mr={1} color="purple.500" />
              Available From <Text as="span" color="red.500">*</Text>
            </Field.Label>
            <Input 
              type="date" 
              {...register("availableDate")} 
              borderRadius="lg"
              size="lg"
            />
            <Field.ErrorText>{errors.availableDate?.message}</Field.ErrorText>
          </Field.Root>
        </Grid>
      </Stack>
    </Box>
  );
}
