import { useAppStore } from "@/app/store";
import { Box, Button, Flex, Spinner, Steps, CloseButton, Text, VStack, HStack } from "@chakra-ui/react";
import {
  FormProvider,
  useForm,
  type FieldPath,
  type Resolver,
} from "react-hook-form";
import { useShallow } from "zustand/react/shallow";
import { propertyFormSchema, type PropertyFormValues } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepOne } from "./form-steps/StepOne";
import { StepTwo } from "./form-steps/StepTwo";
import { StepThree } from "./form-steps/StepThree";
import { useCreateProperty } from "../hooks/useCreateProperty";
import { useEffect } from "react";
import { toast } from "react-toastify";
import type { IProperty } from "../types";
import { useEditProperty } from "../hooks/useEditProperty";
import axios from "axios";
import { LuHouse, LuMapPin, LuCircleCheck } from "react-icons/lu";

const stepLabels = [
  { icon: LuHouse, label: "Basic Info" },
  { icon: LuMapPin, label: "Location & Media" },
  { icon: LuCircleCheck, label: "Review" },
];

export function PropertyForm({ setOpen, propertyToEdit }:{ setOpen: (open: boolean)=>void, propertyToEdit: IProperty | null }) {
  const { currentStep, totalSteps, nextStep, prevStep, resetStep } =
    useAppStore(
      useShallow((state) => ({
        currentStep: state.currentStep,
        totalSteps: state.totalSteps,
        nextStep: state.nextStep,
        prevStep: state.prevStep,
        resetStep: state.resetStep,
      })),
    );

  const methods = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema) as Resolver<PropertyFormValues>,
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      baseRentPrice: 0,
      beds: 0,
      baths: 0,
      area: 0,
      propertyType: "",
      location: {
        coordinates: [] as unknown as [number, number],
      },
      images: [],
      existingImages: [],
      nearTransit: {
        type: "",
        distance: 0,
      },
      parkingSpaces: 0,
      yearBuilt: 2010,
      petAllowed: false,
      appliances: [],
      availableDate: new Date().toISOString().split("T")[0],
      internet: {
        name: "",
        speed: "",
      },
      leaseTermMonths: undefined,
    },
    shouldFocusError: false
  });

  const { handleSubmit, trigger, reset, watch, formState: {isDirty} } = methods;

  const address = watch("location.address")

  const {
    isPending: isCreating,
    mutate: createProperty,
    isSuccess: isCreateSuccess,
    error: createError
  } = useCreateProperty();

  const {
    isPending: isEditing,
    mutate: editProperty,
    isSuccess: isEditingSuccess,
    error: editError
  } = useEditProperty(propertyToEdit?._id || "")

  const apiResponseError = createError || editError

  const isLoading = isCreating || isEditing;

  const onSubmit = async (data: PropertyFormValues) => {
    console.log("Form submitted with data:", data);
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("baseRentPrice", data.baseRentPrice.toString());
    formData.append("beds", data.beds.toString());
    formData.append("baths", data.baths.toString());
    formData.append("area", data.area.toString());
    formData.append("propertyType", data.propertyType);
    formData.append("parkingSpaces", (data.parkingSpaces || 0).toString());
    
    if (data.yearBuilt) {
      formData.append("yearBuilt", data.yearBuilt.toString());
    }
    
    formData.append("petAllowed", data.petAllowed ? "true" : "false");
    
    if (data.availableDate) {
      formData.append("availableDate", data.availableDate);
    }
    
    if (data.leaseTermMonths) {
      formData.append("leaseTermMonths", data.leaseTermMonths.toString());
    }
    
    if (data.nearTransit) {
      formData.append("nearTransit", JSON.stringify(data.nearTransit));
    }
    
    if (data.appliances && data.appliances.length > 0) {
      formData.append("appliances", JSON.stringify(data.appliances));
    }
    
    if (data.internet) {
      formData.append("internet", JSON.stringify(data.internet));
    }

    formData.append("location", JSON.stringify(data.location));

    if (data.existingImages && data.existingImages.length > 0) {
      formData.append("existingImages", JSON.stringify(data.existingImages));
    }

    if (data.images && data.images.length > 0) {
      data.images.forEach((image: File) => {
        formData.append("propertyImages", image);
      });
    }

    if(propertyToEdit){
      editProperty(formData)
      return
    }

    createProperty(formData, {onError: (err) => console.log(err)});
  };

  const handleNext = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    let fieldsToValidate: FieldPath<PropertyFormValues>[] = [];
    if (currentStep === 0) {
      fieldsToValidate = [
        "title",
        "description",
        "baseRentPrice",
        "beds",
        "baths",
        "area",
        "parkingSpaces",
        "petAllowed",
        "availableDate"
      ];
    } else if (currentStep === 1) {
      fieldsToValidate = ["propertyType", "location", "images"];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) nextStep();
  };

  function closeModal() {
    if(isDirty && !confirm("Discard unsaved changes?")) return
    resetStep()
    reset()
    setOpen(false)
  }

  useEffect(() => {
    if (isCreateSuccess || isEditingSuccess) {
      const msg = isCreateSuccess ? "Property was created successfully" : "Property was updated successfully"
      resetStep();
      reset();
      toast.success(msg);
      setOpen(false)
    }
  }, [isCreateSuccess, reset, resetStep, setOpen, isEditingSuccess]);

  useEffect(() => {
    if(propertyToEdit){
      reset({
        title: propertyToEdit.title,
        description: propertyToEdit.description,
        baseRentPrice: propertyToEdit.baseRentPrice,
        beds: propertyToEdit.beds,
        baths: propertyToEdit.baths,
        area: propertyToEdit.area,
        propertyType: propertyToEdit.propertyType,
        location: { coordinates: propertyToEdit.location.coordinates },
        existingImages: propertyToEdit.images,
        nearTransit: propertyToEdit.nearTransit || { type: "", distance: 0 },
        parkingSpaces: propertyToEdit.parkingSpaces || 0,
        yearBuilt: propertyToEdit.yearBuilt,
        petAllowed: propertyToEdit.petAllowed || false,
        appliances: propertyToEdit.appliances || [],
        availableDate: new Date(propertyToEdit.availableDate).toISOString().split("T")[0],
        internet: propertyToEdit.internet || { name: "", speed: "" },
        leaseTermMonths: propertyToEdit.leaseTermMonths
      })
    }
  },[propertyToEdit, reset])

  return (
    <Box gap="6">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={4}>
        <VStack gap={0} align="start">
          <Text fontWeight="bold" fontSize="lg" color="fg">
            {propertyToEdit ? "Edit Property" : "Add New Property"}
          </Text>
          <Text fontSize="sm" color="fg.muted">
            {propertyToEdit ? "Update your property details" : "Fill in the details to list your property"}
          </Text>
        </VStack>
        <CloseButton onClick={closeModal} borderRadius="lg" />
      </Flex>

      {/* Step Indicators with Labels */}
      <Box mb={6}>
        <Steps.Root step={currentStep} count={totalSteps} colorPalette="blue">
          <Steps.List justifyContent="center">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <Steps.Item key={index} index={index}>
                <Flex direction="column" align="center" gap={1}>
                  <Steps.Indicator 
                    borderRadius="full"
                    _current={{
                      bg: "blue.500",
                      color: "white",
                    }}
                  />
                  <Steps.Title 
                    fontSize="xs" 
                    fontWeight={index === currentStep ? "semibold" : "normal"}
                    color={index === currentStep ? "blue.500" : "fg.muted"}
                    display={{ base: "none", md: "block" }}
                  >
                    {stepLabels[index]?.label}
                  </Steps.Title>
                </Flex>
                <Steps.Separator 
                  h="2px" 
                  bg={index < currentStep ? "blue.500" : "border"} 
                  mx={1}
                />
              </Steps.Item>
            ))}
          </Steps.List>
        </Steps.Root>
      </Box>

      {/* Main Form Content */}
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(
            onSubmit,
            (errors) => {
              console.error("Form validation errors:", errors);
              toast.error("Please fix the form errors before submitting");
              const firstError = Object.keys(errors)[0];
              if (firstError) {
                const element = document.querySelector(`[name="${firstError}"]`);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }
            }
          )}
          onKeyDown={(e) => {
            if (e.key === "Enter" && currentStep !== totalSteps - 1) {
              e.preventDefault();
            }
          }}
        >
          {/* API Response Error */}
          {apiResponseError && (
            <Box 
              mb={4} 
              p={3} 
              bg="red.50" 
              _dark={{ bg: "red.950" }}
              borderRadius="lg"
              border="1px solid"
              borderColor="red.200"
            >
              <Text fontSize="sm" color="red.600" _dark={{ color: "red.300" }}>
                {axios.isAxiosError(apiResponseError)
                  ? apiResponseError?.response?.data?.message
                  : "Internal Server Error"}
              </Text>
            </Box>
          )}

          {currentStep === 0 && <StepOne />}
          {currentStep === 1 && <StepTwo />}
          {currentStep === 2 && <StepThree />}

          {/* Navigation Buttons */}
          <Flex 
            mt={6} 
            justify="space-between" 
            align="center"
            pt={4}
            borderTop="1px solid"
            borderColor="border.muted"
          >
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 0}
              borderRadius="lg"
              visibility={currentStep === 0 ? "hidden" : "visible"}
            >
              ← Previous
            </Button>

            <HStack gap={2}>
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                borderRadius="lg"
              >
                Cancel
              </Button>
              
              {currentStep === totalSteps - 1 ? (
                <Button
                  disabled={isLoading || !address}
                  type="submit"
                  colorPalette="blue"
                  borderRadius="lg"
                  px={6}
                >
                  {isLoading ? (
                    <Spinner size="sm" />
                  ) : propertyToEdit ? (
                    "Save Changes"
                  ) : (
                    "Create Property"
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  colorPalette="blue"
                  variant="solid"
                  borderRadius="lg"
                  px={6}
                >
                  Next →
                </Button>
              )}
            </HStack>
          </Flex>
        </form>
      </FormProvider>
    </Box>
  );
}
