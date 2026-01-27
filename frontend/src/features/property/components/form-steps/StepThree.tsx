import {
  Box,
  Field,
  NumberInput,
  Stack,
  Text,
  Select,
  Portal,
  createListCollection,
} from "@chakra-ui/react";
import { useFormContext, Controller } from "react-hook-form";
import type { PropertyFormValues } from "../../schema";
import { useEffect } from "react";

const utilityTypes = createListCollection({
  items: [
    { label: "Included", value: "INCLUDED" },
    { label: "Fixed", value: "FIXED" },
    { label: "Metered", value: "METERED" },
  ],
});

export function StepThree() {
  const {
    register,
    formState: { errors },
    control,
    getValues,
    setValue,
  } = useFormContext<PropertyFormValues>();

  // Initialize utilityFee if it doesn't exist
  useEffect(() => {
    const utilityFee = getValues("utilityFee");
    if (!utilityFee) {
      setValue("utilityFee", {
        electricity: { type: "", amount: undefined },
        water: { type: "", amount: undefined },
        internet: { type: "", amount: undefined },
        trashCollection: { type: "", amount: undefined },
      });
    }
  }, [getValues, setValue]);

  return (
    <Box my="5">
      <Stack gap="5">
        <Text fontWeight="medium" fontSize="lg">Utility Fees</Text>
        
        {/* Electricity */}
        <Box p="4" borderWidth="1px" borderRadius="md">
          <Text fontWeight="medium" mb="3">Electricity</Text>
          <Stack gap="3">
            <Field.Root invalid={!!errors.utilityFee?.electricity?.type}>
              <Field.Label>Type</Field.Label>
              <Controller
                name="utilityFee.electricity.type"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    collection={utilityTypes}
                    size="md"
                    width="full"
                    value={field.value ? [field.value] : []}
                    onValueChange={(details) => field.onChange(details.value[0])}
                    onBlur={field.onBlur}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select type" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {utilityTypes.items.map((item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                )}
              />
              <Field.ErrorText>{errors.utilityFee?.electricity?.type?.message}</Field.ErrorText>
            </Field.Root>
            <Field.Root invalid={!!errors.utilityFee?.electricity?.amount}>
              <Field.Label>Amount ($)</Field.Label>
              <NumberInput.Root defaultValue="0" min={0}>
                <NumberInput.Control>
                  <NumberInput.IncrementTrigger />
                  <NumberInput.DecrementTrigger />
                </NumberInput.Control>
                <NumberInput.Input {...register("utilityFee.electricity.amount")} />
              </NumberInput.Root>
              <Field.ErrorText>{errors.utilityFee?.electricity?.amount?.message}</Field.ErrorText>
            </Field.Root>
          </Stack>
        </Box>

        {/* Water */}
        <Box p="4" borderWidth="1px" borderRadius="md">
          <Text fontWeight="medium" mb="3">Water</Text>
          <Stack gap="3">
            <Field.Root invalid={!!errors.utilityFee?.water?.type}>
              <Field.Label>Type</Field.Label>
              <Controller
                name="utilityFee.water.type"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    collection={utilityTypes}
                    size="md"
                    width="full"
                    value={field.value ? [field.value] : []}
                    onValueChange={(details) => field.onChange(details.value[0])}
                    onBlur={field.onBlur}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select type" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {utilityTypes.items.map((item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                )}
              />
              <Field.ErrorText>{errors.utilityFee?.water?.type?.message}</Field.ErrorText>
            </Field.Root>
            <Field.Root invalid={!!errors.utilityFee?.water?.amount}>
              <Field.Label>Amount ($)</Field.Label>
              <NumberInput.Root defaultValue="0" min={0}>
                <NumberInput.Control>
                  <NumberInput.IncrementTrigger />
                  <NumberInput.DecrementTrigger />
                </NumberInput.Control>
                <NumberInput.Input {...register("utilityFee.water.amount")} />
              </NumberInput.Root>
              <Field.ErrorText>{errors.utilityFee?.water?.amount?.message}</Field.ErrorText>
            </Field.Root>
          </Stack>
        </Box>

        {/* Internet Utility */}
        <Box p="4" borderWidth="1px" borderRadius="md">
          <Text fontWeight="medium" mb="3">Internet (Utility)</Text>
          <Stack gap="3">
            <Field.Root invalid={!!errors.utilityFee?.internet?.type}>
              <Field.Label>Type</Field.Label>
              <Controller
                name="utilityFee.internet.type"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    collection={utilityTypes}
                    size="md"
                    width="full"
                    value={field.value ? [field.value] : []}
                    onValueChange={(details) => field.onChange(details.value[0])}
                    onBlur={field.onBlur}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select type" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {utilityTypes.items.map((item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                )}
              />
              <Field.ErrorText>{errors.utilityFee?.internet?.type?.message}</Field.ErrorText>
            </Field.Root>
            <Field.Root invalid={!!errors.utilityFee?.internet?.amount}>
              <Field.Label>Amount ($)</Field.Label>
              <NumberInput.Root defaultValue="0" min={0}>
                <NumberInput.Control>
                  <NumberInput.IncrementTrigger />
                  <NumberInput.DecrementTrigger />
                </NumberInput.Control>
                <NumberInput.Input {...register("utilityFee.internet.amount")} />
              </NumberInput.Root>
              <Field.ErrorText>{errors.utilityFee?.internet?.amount?.message}</Field.ErrorText>
            </Field.Root>
          </Stack>
        </Box>

        {/* Trash Collection */}
        <Box p="4" borderWidth="1px" borderRadius="md">
          <Text fontWeight="medium" mb="3">Trash Collection</Text>
          <Stack gap="3">
            <Field.Root invalid={!!errors.utilityFee?.trashCollection?.type}>
              <Field.Label>Type</Field.Label>
              <Controller
                name="utilityFee.trashCollection.type"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    collection={utilityTypes}
                    size="md"
                    width="full"
                    value={field.value ? [field.value] : []}
                    onValueChange={(details) => field.onChange(details.value[0])}
                    onBlur={field.onBlur}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select type" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {utilityTypes.items.map((item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                )}
              />
              <Field.ErrorText>{errors.utilityFee?.trashCollection?.type?.message}</Field.ErrorText>
            </Field.Root>
            <Field.Root invalid={!!errors.utilityFee?.trashCollection?.amount}>
              <Field.Label>Amount ($)</Field.Label>
              <NumberInput.Root defaultValue="0" min={0}>
                <NumberInput.Control>
                  <NumberInput.IncrementTrigger />
                  <NumberInput.DecrementTrigger />
                </NumberInput.Control>
                <NumberInput.Input {...register("utilityFee.trashCollection.amount")} />
              </NumberInput.Root>
              <Field.ErrorText>{errors.utilityFee?.trashCollection?.amount?.message}</Field.ErrorText>
            </Field.Root>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
