import {
  Box,
  Button,
  createListCollection,
  Field,
  FileUpload,
  Flex,
  Float,
  Stack,
  Text,
  useFileUploadContext,
  Image,
  For,
  CloseButton,
  Input,
  NumberInput,
  Checkbox,
  Grid,
  Icon,
} from "@chakra-ui/react";
import { LocationPicker } from "../map/LocationPicker";
import { useEffect } from "react";
import { LuFileImage, LuMapPin, LuWifi, LuWarehouse, LuBus } from "react-icons/lu";
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
  "AC",
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
    <Box my="2">
      <Stack gap={6}>
        {/* Property Type */}
        <Box 
          p={4} 
          bg="bg.subtle" 
          _dark={{ bg: "whiteAlpha.50" }}
          borderRadius="xl"
        >
          <Text fontSize="sm" fontWeight="semibold" color="fg.muted" mb={3}>
            Property Type <Text as="span" color="red.500">*</Text>
          </Text>
          
          <Grid templateColumns={{ base: "1fr 1fr", md: "repeat(4, 1fr)" }} gap={2}>
            {propertyTypes.items.map((type) => (
              <Box
                key={type.value}
                p={3}
                borderRadius="lg"
                border="1px solid"
                borderColor={getValues("propertyType") === type.value ? "blue.500" : "border"}
                bg={getValues("propertyType") === type.value ? "blue.50" : "transparent"}
                _dark={{ bg: getValues("propertyType") === type.value ? "blue.950" : "transparent" }}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ borderColor: "blue.300" }}
                onClick={() => setValue("propertyType", type.value, { shouldDirty: true })}
              >
                <Text fontSize="sm" fontWeight="medium" textAlign="center">
                  {type.label}
                </Text>
              </Box>
            ))}
          </Grid>
          {errors.propertyType && (
            <Text color="red.500" fontSize="xs" mt={2}>
              {errors.propertyType.message}
            </Text>
          )}
        </Box>

        {/* Location Picker */}
        <Box>
          <Text fontWeight="semibold" mb={2}>
            <Icon as={LuMapPin} boxSize={4} mr={1} color="red.500" />
            Property Location <Text as="span" color="red.500">*</Text>
          </Text>
          <Box 
            borderRadius="xl" 
            overflow="hidden" 
            border="1px solid" 
            borderColor={errors.location?.coordinates ? "red.300" : "border"}
          >
            <LocationPicker
              defaultValue={initialLocation}
              onSelect={(coords) => {
                setValue("location.coordinates", [coords.lat, coords.lng], {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
            />
          </Box>
          {errors.location?.coordinates && (
            <Text color="red.500" fontSize="xs" mt={1}>
              {errors.location.coordinates.message}
            </Text>
          )}
        </Box>

        {/* Image Upload */}
        <Box>
          <Text fontWeight="semibold" mb={2}>
            <Icon as={LuFileImage} boxSize={4} mr={1} color="blue.500" />
            Property Images <Text as="span" color="red.500">*</Text>
          </Text>
          <FileUpload.Root
            accept="image/*"
            maxFiles={5}
            maxFileSize={5 * 1024 * 1024}
          >
            <FileUpload.HiddenInput />
            <FileUpload.Trigger asChild>
              <Button 
                variant="outline" 
                size="md"
                borderRadius="lg"
                borderStyle="dashed"
              >
                <LuFileImage /> Click to upload images
              </Button>
            </FileUpload.Trigger>
            <FileUploadList setValue={setValue} />
          </FileUpload.Root>
          {errors.images && (
            <Text color="red.500" fontSize="xs" mt={1}>
              {errors.images.message}
            </Text>
          )}
        </Box>

        {/* Existing Images */}
        {existingImages && existingImages.length > 0 && (
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={2}>
              Existing Images ({existingImages.length})
            </Text>
            <Flex align="center" gap="2" flexWrap="wrap">
              <For each={existingImages}>
                {(image, i) => (
                  <Box position="relative" key={i}>
                    <Image
                      src={`${import.meta.env.VITE_FILE_URL}/property-images/${image}`}
                      width="80px"
                      height="80px"
                      objectFit="cover"
                      borderRadius="lg"
                    />
                    <CloseButton
                      size="xs"
                      position="absolute"
                      top="1"
                      right="1"
                      bg="blackAlpha.600"
                      color="white"
                      borderRadius="full"
                      _hover={{ bg: "red.500", transform: "scale(1.1)" }}
                      transition="all 0.2s"
                      zIndex="1"
                      onClick={() => removeImage(i)}
                    />
                  </Box>
                )}
              </For>
            </Flex>
          </Box>
        )}

        {/* Transit & Lease */}
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
          <Box 
            p={4} 
            bg="bg.subtle" 
            _dark={{ bg: "whiteAlpha.50" }}
            borderRadius="xl"
          >
            <Text fontSize="sm" fontWeight="semibold" color="fg.muted" mb={3}>
              <Icon as={LuBus} boxSize={4} mr={1} />
              Near Transit
            </Text>
            <Flex align="center" gap={2}>
              <Field.Root invalid={!!errors.nearTransit?.type}>
                <Input
                  type="text"
                  placeholder="Transit type"
                  {...register("nearTransit.type")}
                  size="sm"
                  borderRadius="lg"
                />
              </Field.Root>
              <Field.Root invalid={!!errors.nearTransit?.distance}>
                <NumberInput.Root defaultValue="0" min={0} size="sm" w="100px">
                  <NumberInput.Control borderRadius="lg">
                    <NumberInput.IncrementTrigger />
                    <NumberInput.DecrementTrigger />
                  </NumberInput.Control>
                  <NumberInput.Input {...register("nearTransit.distance")} />
                </NumberInput.Root>
              </Field.Root>
            </Flex>
          </Box>

          <Box 
            p={4} 
            bg="bg.subtle" 
            _dark={{ bg: "whiteAlpha.50" }}
            borderRadius="xl"
          >
            <Text fontSize="sm" fontWeight="semibold" color="fg.muted" mb={3}>
              Lease Term
            </Text>
            <Field.Root invalid={!!errors.leaseTermMonths}>
              <NumberInput.Root defaultValue="12" min={6} size="sm">
                <NumberInput.Control borderRadius="lg">
                  <NumberInput.IncrementTrigger />
                  <NumberInput.DecrementTrigger />
                </NumberInput.Control>
                <NumberInput.Input {...register("leaseTermMonths")} />
              </NumberInput.Root>
              <Text fontSize="xs" color="fg.muted" mt={1}>Min: 6 months</Text>
              <Field.ErrorText>{errors.leaseTermMonths?.message}</Field.ErrorText>
            </Field.Root>
          </Box>
        </Grid>

        {/* Appliances */}
        <Box 
          p={4} 
          bg="bg.subtle" 
          _dark={{ bg: "whiteAlpha.50" }}
          borderRadius="xl"
        >
          <Text fontSize="sm" fontWeight="semibold" color="fg.muted" mb={3}>
            <Icon as={LuWarehouse} boxSize={4} mr={1} />
            Appliances
          </Text>
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
                <Flex gap={3} flexWrap="wrap">
                  {applianceOptions.map((appliance) => {
                    const isChecked = field.value?.includes(appliance);
                    return (
                      <Checkbox.Root
                        key={appliance}
                        checked={isChecked}
                        onCheckedChange={(details) =>
                          handleCheckedChange(appliance, !!details.checked)
                        }
                        cursor="pointer"
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control 
                          borderRadius="md"
                          _checked={{ bg: "blue.500", borderColor: "blue.500" }}
                        >
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
        </Box>

        {/* Internet */}
        <Box 
          p={4} 
          bg="bg.subtle" 
          _dark={{ bg: "whiteAlpha.50" }}
          borderRadius="xl"
        >
          <Text fontSize="sm" fontWeight="semibold" color="fg.muted" mb={3}>
            <Icon as={LuWifi} boxSize={4} mr={1} />
            Internet
          </Text>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={3}>
            <Field.Root invalid={!!errors.internet?.name}>
              <Input
                type="text"
                placeholder="Provider (e.g., Comcast)"
                {...register("internet.name")}
                size="sm"
                borderRadius="lg"
              />
            </Field.Root>
            <Field.Root invalid={!!errors.internet?.speed}>
              <Input
                type="text"
                placeholder="Speed (e.g., 100 Mbps)"
                {...register("internet.speed")}
                size="sm"
                borderRadius="lg"
              />
            </Field.Root>
          </Grid>
        </Box>
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

  const savedImages = watch("images") || [];

  useEffect(() => {
    if (fileUpload.acceptedFiles.length > 0) {
      setValue("images", fileUpload.acceptedFiles, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [fileUpload.acceptedFiles, setValue]);

  if (savedImages.length === 0) return null;

  return (
    <FileUpload.ItemGroup
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      gap={3}
      mt={3}
    >
      {savedImages.map((file: File, index: number) => (
        <FileUpload.Item
          w="auto"
          boxSize="24"
          p="1"
          file={file}
          key={index}
          borderRadius="lg"
          overflow="hidden"
          border="1px solid"
          borderColor="border"
        >
          <FileUpload.ItemPreviewImage 
            objectFit="cover" 
            w="full" 
            h="full" 
          />
          <Float placement="top-end">
            <FileUpload.ItemDeleteTrigger
              onClick={() => {
                const updatedImages = savedImages.filter((_, i) => i !== index);
                setValue("images", updatedImages);
                fileUpload.clearFiles();
              }}
              colorPalette="red"
              boxSize="5"
              borderRadius="full"
              bg="blackAlpha.600"
              color="white"
              _hover={{ bg: "red.500" }}
            >
              ×
            </FileUpload.ItemDeleteTrigger>
          </Float>
        </FileUpload.Item>
      ))}
    </FileUpload.ItemGroup>
  );
};
