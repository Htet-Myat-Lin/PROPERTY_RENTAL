import { useAppStore } from "@/app/store";
import { Box, Button, ButtonGroup, Flex, Spinner, Steps, CloseButton, Text } from "@chakra-ui/react";
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
import { StepFour } from "./form-steps/StepFour";
import { useCreateProperty } from "../hooks/useCreateProperty";
import { useEffect } from "react";
import { toast } from "react-toastify";
import type { IProperty } from "../types";
import { useEditProperty } from "../hooks/useEditProperty";
import axios from "axios";

export function PropertyForm({ setOpen, propertyToEdit }:{ setOpen: (opoen: boolean)=>void, propertyToEdit: IProperty | null }) {
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
    mode: "onChange", // Validate on change so errors clear when fields become valid
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
      utilityFee: undefined,
    },
    shouldFocusError: false
  });

  const { handleSubmit, trigger, reset, watch, formState: {isDirty} } = methods;

  // eslint-disable-next-line react-hooks/incompatible-library
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

  const onSubmit = async (data: PropertyFormValues) => {
    console.log("Form submitted with data:", data);
    const formData = new FormData();

    // Add all form fields
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
    
    if (data.utilityFee) {
      formData.append("utilityFee", JSON.stringify(data.utilityFee));
    }

    // Add location data
    formData.append("location", JSON.stringify(data.location));

    // Add existing images if any
    if (data.existingImages && data.existingImages.length > 0) {
      formData.append("existingImages", JSON.stringify(data.existingImages));
    }

    // Add new images
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
    } else if (currentStep === 2) {
      // Don't validate utilityFee fields as they're optional
      fieldsToValidate = [];
    } else if (currentStep === 3) {
      // Review step - no validation needed
      fieldsToValidate = [];
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

  // Initialize data for edit
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
        leaseTermMonths: propertyToEdit.leaseTermMonths,
        utilityFee: propertyToEdit.utilityFee || {
          electricity: { type: "", amount: undefined },
          water: { type: "", amount: undefined },
          internet: { type: "", amount: undefined },
          trashCollection: { type: "", amount: undefined },
        },
      })
    }
  },[propertyToEdit, reset])

  return (
    <Box gap="6">
      <Flex justify="end" mb="2"><CloseButton onClick={closeModal} /></Flex>
      <Steps.Root step={currentStep} count={totalSteps} colorPalette="blue">
        <Steps.List>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <Steps.Item key={index} index={index}>
              <Steps.Indicator />
              <Steps.Separator />
            </Steps.Item>
          ))}
        </Steps.List>

        {/* Main Form Content Here */}
        <FormProvider {...methods}>
            <form
            onSubmit={handleSubmit(
              onSubmit,
              (errors) => {
                console.error("Form validation errors:", errors);
                toast.error("Please fix the form errors before submitting");
                // Scroll to first error
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
            {/* API RESPONSE ERROR */}
            {apiResponseError && (
              <Text alignSelf="flex-start" fontSize="xs" color="red.500">
                {axios.isAxiosError(apiResponseError)
                  ? apiResponseError?.response?.data?.message
                  : "Internal Server Error"}
              </Text>
            )}

            {currentStep === 0 && <StepOne />}
            {currentStep === 1 && <StepTwo />}
            {currentStep === 2 && <StepThree />}
            {currentStep === 3 && <StepFour />}

            <ButtonGroup
              size="sm"
              variant="outline"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Button
                type="button"
                disabled={currentStep === 0}
                onClick={prevStep}
                colorPalette="blue"
                variant="outline"
              >
                Prev
              </Button>
              {currentStep === totalSteps - 1 ? (
                <Button disabled={isCreating || isEditing || !address} type="submit" colorPalette="blue">
                  {isCreating || isEditing ? <Spinner /> : propertyToEdit ? "Edit Property" : "Create Property"}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  colorPalette="blue"
                  variant="outline"
                >
                  Next
                </Button>
              )}
            </ButtonGroup>
          </form>
        </FormProvider>
      </Steps.Root>
    </Box>
  );
}
