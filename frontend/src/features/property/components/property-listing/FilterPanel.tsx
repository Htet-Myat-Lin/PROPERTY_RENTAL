import { Flex, Stack, Text, Button, HStack, Separator, For, Badge, Checkbox, NativeSelect, NumberInput } from "@chakra-ui/react";

const PROPERTY_TYPES = ["Apartment", "House", "Condo", "Villa"];

interface FilterPanelProps {
  propertyTypesParam: string[];
  bedroomsParam: string;
  bathroomsParam: string;
  leaseTermMonthsParam: string;
  priceRange: { min: number; max: number };
  activeFilterCount: number;
  onPropertyTypeChange: (v: string) => void;
  onBedroomsChange: (v: string) => void;
  onBathroomsChange: (v: string) => void;
  onLeaseTermChange: (v: string) => void;
  onPriceRangeChange: (r: { min: number; max: number }) => void;
  onClearFilters: () => void;
}

export function FilterPanel({
  propertyTypesParam,
  bedroomsParam,
  bathroomsParam,
  leaseTermMonthsParam,
  priceRange,
  activeFilterCount,
  onPropertyTypeChange,
  onBedroomsChange,
  onBathroomsChange,
  onLeaseTermChange,
  onPriceRangeChange,
  onClearFilters,
}: FilterPanelProps) {
  return (
    <Stack gap="5" h="full">
      {/* Header */}
      <Flex justify="space-between" align="center">
        <HStack gap="2">
          <Text fontWeight="bold" fontSize="sm" letterSpacing="tight">
            Filters
          </Text>
          {activeFilterCount > 0 && (
            <Badge
              colorPalette="blue"
              size="sm"
              borderRadius="full"
              px="1.5"
            >
              {activeFilterCount}
            </Badge>
          )}
        </HStack>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="xs"
            colorPalette="red"
            onClick={onClearFilters}
          >
            Clear all
          </Button>
        )}
      </Flex>

      <Separator />

      {/* Property Type */}
      <Stack gap="3">
        <Text
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="widest"
          color="fg.muted"
        >
          Property Type
        </Text>
        <Stack gap="2">
          <For each={PROPERTY_TYPES}>
            {(type) => (
              <Checkbox.Root
                key={type}
                variant="solid"
                colorPalette="blue"
                size="sm"
                checked={propertyTypesParam.includes(type)}
                onCheckedChange={() => onPropertyTypeChange(type)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control borderRadius="md" />
                <Checkbox.Label fontSize="sm">{type}</Checkbox.Label>
              </Checkbox.Root>
            )}
          </For>
        </Stack>
      </Stack>

      <Separator />

      {/* Bedrooms */}
      <Stack gap="2">
        <Text
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="widest"
          color="fg.muted"
        >
          Min Bedrooms
        </Text>
        <NativeSelect.Root size="sm">
          <NativeSelect.Field
            borderRadius="lg"
            value={bedroomsParam}
            onChange={(e) => onBedroomsChange(e.currentTarget.value)}
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Stack>

      {/* Bathrooms */}
      <Stack gap="2">
        <Text
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="widest"
          color="fg.muted"
        >
          Min Bathrooms
        </Text>
        <NativeSelect.Root size="sm">
          <NativeSelect.Field
            borderRadius="lg"
            value={bathroomsParam}
            onChange={(e) => onBathroomsChange(e.currentTarget.value)}
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Stack>

      {/* Lease Term */}
      <Stack gap="2">
        <Text
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="widest"
          color="fg.muted"
        >
          Min Lease Term
        </Text>
        <NativeSelect.Root size="sm">
          <NativeSelect.Field
            borderRadius="lg"
            value={leaseTermMonthsParam}
            onChange={(e) => onLeaseTermChange(e.currentTarget.value)}
          >
            <option value="">Any</option>
            <option value="6">6+ months</option>
            <option value="12">12+ months</option>
            <option value="24">24+ months</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Stack>

      <Separator />

      {/* Price Range */}
      <Stack gap="3">
        <Flex justify="space-between" align="center">
          <Text
            fontSize="xs"
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="widest"
            color="fg.muted"
          >
            Price Range
          </Text>
          {(priceRange.min > 0 || priceRange.max < 10000000) && (
            <Text fontSize="xs" color="blue.500" fontWeight="semibold">
              ${priceRange.min.toLocaleString()} –{" "}
              {priceRange.max === 10000000
                ? "∞"
                : "$" + priceRange.max.toLocaleString()}
            </Text>
          )}
        </Flex>

        <Stack gap="2.5">
          <Flex align="center" gap="3">
            <Text
              fontSize="xs"
              color="fg.muted"
              w="8"
              flexShrink={0}
            >
              Min
            </Text>
            <NumberInput.Root
              size="sm"
              value={String(priceRange.min)}
              min={0}
              max={priceRange.max}
              flex="1"
              onValueChange={(e) =>
                onPriceRangeChange({
                  ...priceRange,
                  min: Math.max(0, parseInt(e.value) || 0),
                })
              }
            >
              <NumberInput.Input borderRadius="lg" />
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
            </NumberInput.Root>
          </Flex>
          <Flex align="center" gap="3">
            <Text
              fontSize="xs"
              color="fg.muted"
              w="8"
              flexShrink={0}
            >
              Max
            </Text>
            <NumberInput.Root
              size="sm"
              value={String(priceRange.max)}
              min={priceRange.min}
              max={10000000}
              flex="1"
              onValueChange={(e) =>
                onPriceRangeChange({
                  ...priceRange,
                  max: Math.min(
                    10000000,
                    parseInt(e.value) || 10000000
                  ),
                })
              }
            >
              <NumberInput.Input borderRadius="lg" />
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
            </NumberInput.Root>
          </Flex>
        </Stack>
      </Stack>
    </Stack>
  );
}