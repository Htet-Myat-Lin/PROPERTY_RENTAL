import {
  Box,
  Button,
  createListCollection,
  Field,
  FileUpload,
  Flex,
  Float,
  Portal,
  Select,
  Stack,
  Text,
  useFileUploadContext,
  Image,
  For,
  CloseButton,
  Input,
  NumberInput,
  Checkbox,
} from "@chakra-ui/react";
import { LocationPicker } from "../LocationPicker";
import { useEffect } from "react";
import { LuFileImage, LuX } from "react-icons/lu";
import {
  Controller,
  useFormContext,
  type UseFormSetValue,
} from "react-hook-form";
import type { PropertyFormValues } from "../../schema";

const propertyTypes = createListCollection({
  items: [
    { label: "Apartment", value: "Apartment" },
    { label: "Condo", value: "Condo" },
    { label: "Villa", value: "Villa" },
    { label: "House", value: "House" },
  ],
});

const applianceOptions = [
  "Refrigerator",
  "Dishwasher",
  "Washing Machine",
  "Dryer",
  "Microwave",
  "Oven",
  "Stove",
];

export function StepTwo() {
  const {
    formState: { errors },
    setValue,
    control,
    getValues,
    register,
  } = useFormContext<PropertyFormValues>();

  const savedCoords = getValues("location.coordinates");
  const initialLocation =
    savedCoords.length === 2
      ? { lat: savedCoords[0], lng: savedCoords[1] }
      : null;

  const existingImages = getValues("existingImages");

  const removeImage = (index: number) => {
    const updated = existingImages?.filter((_, i) => i !== index);
    setValue("existingImages", updated, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <Box my="5">
      <Stack gap="5">
        {/* Property Types */}
        <Field.Root invalid={!!errors.propertyType}>
          <Field.Label>Select Property</Field.Label>

          <Controller
            name="propertyType"
            control={control}
            render={({ field }) => (
              <Select.Root
                collection={propertyTypes}
                size="md"
                width="full"
                name={field.name}
                value={field.value ? [field.value] : []}
                onValueChange={(details) => field.onChange(details.value[0])}
                onBlur={field.onBlur}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select Property Types" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {propertyTypes.items.map((item) => (
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
          <Field.ErrorText>{errors.propertyType?.message}</Field.ErrorText>
        </Field.Root>

        {/* Location Picker */}
        <Stack>
          <Text fontWeight="medium">Select Property Location</Text>
          <LocationPicker
            defaultValue={initialLocation} // Pass it here
            onSelect={(loc) => {
              // 2. Directly update RHF state
              setValue("location.coordinates", [loc.lat, loc.lng], {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
          />
          {errors.location?.coordinates && (
            <Text color="red.600" fontSize="xs">
              {errors.location.coordinates.message}
            </Text>
          )}
        </Stack>

        {/* Image Upload */}
        <Stack>
          <Text fontWeight="medium">Property Images</Text>
          <FileUpload.Root
            accept="image/*"
            maxFiles={5}
            maxFileSize={5 * 1024 * 1024}
          >
            <FileUpload.HiddenInput />
            <FileUpload.Trigger asChild>
              <Button variant="outline" size="sm">
                <LuFileImage /> Upload
              </Button>
            </FileUpload.Trigger>
            <FileUploadList setValue={setValue} />
          </FileUpload.Root>
          {errors.images && (
            <Text color="red.600" fontSize="xs">
              {errors.images.message}
            </Text>
          )}
        </Stack>

        {/* Existing Images */}
        {existingImages && existingImages.length > 0 && (
          <Stack>
            <Text fontWeight="medium">Existing Images</Text>
            <Flex align="center" gap="1">
              <For each={existingImages}>
                {(image, i) => (
                  <Box position="relative" key={i}>
                    <Image
                      src={`${import.meta.env.VITE_FILE_URL}/property-images/${image}`}
                      width="80px"
                      height="80px"
                      objectFit="cover"
                    />
                    <CloseButton
                      size="xs"
                      position="absolute"
                      top="0.5"
                      right="0.5"
                      bg="blackAlpha.600"
                      backdropFilter="blur(4px)"
                      color="white"
                      rounded="full"
                      _hover={{ bg: "red.500", transform: "scale(1.1)" }}
                      transition="all 0.2s"
                      zIndex="1"
                      onClick={() => removeImage(i)}
                    />
                  </Box>
                )}
              </For>
            </Flex>
          </Stack>
        )}

        {/* Near Transit */}
        <Stack>
          <Text fontWeight="medium">Near Transit</Text>
          <Flex align="center" gap="2">
            <Field.Root invalid={!!errors.nearTransit?.type}>
              <Field.Label>Transit Type</Field.Label>
              <Input
                type="text"
                placeholder="e.g., Bus, Metro, Train"
                {...register("nearTransit.type")}
              />
              <Field.ErrorText>
                {errors.nearTransit?.type?.message}
              </Field.ErrorText>
            </Field.Root>
            <Field.Root invalid={!!errors.nearTransit?.distance}>
              <Field.Label>Distance (meters)</Field.Label>
              <NumberInput.Root defaultValue="0" min={0}>
                <NumberInput.Control>
                  <NumberInput.IncrementTrigger />
                  <NumberInput.DecrementTrigger />
                </NumberInput.Control>
                <NumberInput.Input {...register("nearTransit.distance")} />
              </NumberInput.Root>
              <Field.ErrorText>
                {errors.nearTransit?.distance?.message}
              </Field.ErrorText>
            </Field.Root>
          </Flex>
        </Stack>

        {/* Appliances */}
        <Field.Root invalid={!!errors.appliances}>
          <Field.Label fontWeight="medium" mb="2">
            Appliances
          </Field.Label>

          <Controller
            name="appliances"
            control={control}
            defaultValue={[]}
            render={({ field }) => {
              const handleCheckedChange = (
                appliance: string,
                isChecked: boolean,
              ) => {
                const currentValues = field.value || [];
                const nextValues = isChecked
                  ? [...currentValues, appliance]
                  : currentValues.filter((v: string) => v !== appliance);

                field.onChange(nextValues);
              };

              return (
                <Flex
                  gap="4"
                  flexWrap="wrap"
                >
                  {applianceOptions.map((appliance) => {
                    const isChecked = field.value?.includes(appliance);

                    const slug = appliance.replace(/\s+/g, "-").toLowerCase();

                    return (
                      <Checkbox.Root
                        key={appliance}
                        ids={{
                          root: `checkbox-root-${slug}`,
                          hiddenInput: `checkbox-input-${slug}`,
                          label: `checkbox-label-${slug}`,
                        }}
                        checked={isChecked}
                        onCheckedChange={(details) =>
                          handleCheckedChange(appliance, !!details.checked)
                        }
                        cursor="pointer"
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Label fontSize="sm" cursor="pointer">
                          {appliance}
                        </Checkbox.Label>
                      </Checkbox.Root>
                    );
                  })}
                </Flex>
              );
            }}
          />
          {errors.appliances && (
            <Field.ErrorText>
              {errors.appliances.message as string}
            </Field.ErrorText>
          )}
        </Field.Root>

        {/* Internet */}
        <Stack>
          <Text fontWeight="medium">Internet</Text>
          <Flex align="center" gap="2">
            <Field.Root invalid={!!errors.internet?.name}>
              <Field.Label>Provider Name</Field.Label>
              <Input
                type="text"
                placeholder="e.g., Comcast, Verizon"
                {...register("internet.name")}
              />
              <Field.ErrorText>
                {errors.internet?.name?.message}
              </Field.ErrorText>
            </Field.Root>
            <Field.Root invalid={!!errors.internet?.speed}>
              <Field.Label>Speed</Field.Label>
              <Input
                type="text"
                placeholder="e.g., 100 Mbps"
                {...register("internet.speed")}
              />
              <Field.ErrorText>
                {errors.internet?.speed?.message}
              </Field.ErrorText>
            </Field.Root>
          </Flex>
        </Stack>

        {/* Lease Term */}
        <Field.Root invalid={!!errors.leaseTermMonths}>
          <Field.Label>Lease Term (months)</Field.Label>
          <NumberInput.Root defaultValue="12" min={6}>
            <NumberInput.Control>
              <NumberInput.IncrementTrigger />
              <NumberInput.DecrementTrigger />
            </NumberInput.Control>
            <NumberInput.Input {...register("leaseTermMonths")} />
          </NumberInput.Root>
          <Field.ErrorText>{errors.leaseTermMonths?.message}</Field.ErrorText>
        </Field.Root>
      </Stack>
    </Box>
  );
}

const FileUploadList = ({
  setValue,
}: {
  setValue: UseFormSetValue<PropertyFormValues>;
}) => {
  const { watch } = useFormContext<PropertyFormValues>();
  const fileUpload = useFileUploadContext();

  // Watch RHF state instead of relying on context.acceptedFiles
  const savedImages = watch("images") || [];

  // 1. Sync new files from the picker context to RHF
  useEffect(() => {
    if (fileUpload.acceptedFiles.length > 0) {
      setValue("images", fileUpload.acceptedFiles, {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
  }, [fileUpload.acceptedFiles, setValue]);

  // If there are no images in RHF, don't show the list
  if (savedImages.length === 0) return null;

  return (
    <FileUpload.ItemGroup
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      gap="4"
    >
      {savedImages.map((file: File, index: number) => (
        <FileUpload.Item
          w="auto"
          boxSize="20"
          p="2"
          file={file}
          // Use index + name for key to avoid issues when returning to step
          key={`${file.name}-${index}`}
        >
          <FileUpload.ItemPreviewImage />
          <Float placement="top-end">
            <FileUpload.ItemDeleteTrigger
              onClick={() => {
                // Manually filter out the deleted image from RHF state
                const updatedImages = savedImages.filter((_, i) => i !== index);
                setValue("images", updatedImages);
                // Also clear from FileUpload context so they don't reappear
                fileUpload.clearFiles();
              }}
              colorPalette="red"
              boxSize="4"
              layerStyle="fill.solid"
            >
              <LuX />
            </FileUpload.ItemDeleteTrigger>
          </Float>
        </FileUpload.Item>
      ))}
    </FileUpload.ItemGroup>
  );
};
