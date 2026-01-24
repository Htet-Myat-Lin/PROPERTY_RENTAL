import { useAppStore } from "@/app/store";
import { Box, Button, ButtonGroup, Flex, Spinner, Steps, CloseButton } from "@chakra-ui/react";
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
    defaultValues: {
      title: "",
      description: "",
      rentPrice: 0,
      beds: 0,
      baths: 0,
      area: 0,
      propertyType: "",
      location: {
        coordinates: [] as unknown as [number, number],
      },
      images: [],
      existingImages: [],
    },
    shouldFocusError: false
  });

  const { handleSubmit, trigger, reset, formState: {isDirty} } = methods;

  const {
    isPending: isCreating,
    mutate: createProperty,
    isSuccess: isCreateSuccess,
  } = useCreateProperty();

  const {
    isPending: isEditing,
    mutate: editProperty,
    isSuccess: isEditingSuccess
  } = useEditProperty(propertyToEdit?._id || "")

  const onSubmit = async (data: PropertyFormValues) => {
    const formData = new FormData();

    // Add all form fields
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("rentPrice", data.rentPrice.toString());
    formData.append("beds", data.beds.toString());
    formData.append("baths", data.baths.toString());
    formData.append("area", data.area.toString());
    formData.append("propertyType", data.propertyType);

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

    createProperty(formData);
  };

  const handleNext = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    let fieldsToValidate: FieldPath<PropertyFormValues>[] = [];
    if (currentStep === 0) {
      fieldsToValidate = [
        "title",
        "description",
        "rentPrice",
        "beds",
        "baths",
        "area",
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

  // Initialize data for edit
  useEffect(() => {
    if(propertyToEdit){
      reset({
        title: propertyToEdit.title,
        description: propertyToEdit.description,
        rentPrice: propertyToEdit.rentPrice,
        beds: propertyToEdit.beds,
        baths: propertyToEdit.baths,
        area: propertyToEdit.area,
        propertyType: propertyToEdit.propertyType,
        location: { coordinates: propertyToEdit.location.coordinates },
        existingImages: propertyToEdit.images
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
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && currentStep !== totalSteps - 1) {
                e.preventDefault();
              }
            }}
          >
            {currentStep === 0 && <StepOne />}
            {currentStep === 1 && <StepTwo />}
            {currentStep === 2 && <StepThree />}

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
                <Button disabled={isCreating || isEditing} type="submit" colorPalette="blue">
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
