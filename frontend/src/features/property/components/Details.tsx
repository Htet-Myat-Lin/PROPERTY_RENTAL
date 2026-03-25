import {
  Box,
  Stack,
  SimpleGrid,
  GridItem,
} from "@chakra-ui/react";
import {
  LuSquare,
  LuCar,
  LuCalendarDays,
  LuPawPrint,
  LuClock,
  LuCalendarCheck,
  LuBuilding,
  LuBed,
  LuBath
} from "react-icons/lu";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import { useGetPropertyDetail } from "../hooks/useGetPropertyDetail";
import { formateDate } from "@/utils/format-date";
import { PropertyDetailSkeleton } from "./property-details/PropertyDetailSkeleton";
import { PropertyNotFound } from "./property-details/PropertyNotFound";
import { PropertyBreadcrumb } from "./property-details/PropertyBreadcrumb";
import { HeroHeader } from "./property-details/HeroHeader";
import { PropertyImageCarosel } from "./property-details/PropertyImageCarosel";
import { KeyDetails } from "./property-details/KeyDetails";
import { PropertyDescription } from "./property-details/PropertyDescription";
import { useParams } from "react-router";
import { FeatureAndConnectivity } from "./property-details/FeaturesAndConnectivity";
import { LandlordCard } from "./property-details/LandlordCard";


export function Details() {
  const { propertyId } = useParams();
  const { data, isPending } = useGetPropertyDetail(propertyId!);
  const property = data?.content?.property;

  if (isPending) {
    return <PropertyDetailSkeleton />
  }

  if (!property) {
    return <PropertyNotFound />
  }

  const mapPosition = new L.LatLng(
    property?.coordinates[0],
    property?.coordinates[1],
  );
  const mapCenter: [number, number] = [
    property?.coordinates[0],
    property?.coordinates[1],
  ];

  const propertyImages = property?.images;
  const appliances = property?.appliances;
  const keyDetails = [
    { label: "Bedrooms", value: property?.beds, unit: "beds", icon: LuBed },
    { label: "Bathrooms", value: property?.baths, unit: "baths", icon: LuBath },
    { label: "Area", value: property?.area, unit: "sq ft", icon: LuSquare },
    { label: "Property Type", value: property?.propertyType, unit: "", icon: LuBuilding, },
    { label: "Parking", value: property?.parkingSpaces, unit: property?.parkingSpaces === 1 ? "space" : "spaces", icon: LuCar, },
    { label: "Year Built", value: property?.yearBuilt, unit: "", icon: LuCalendarDays, },
    { label: "Pets Allowed", value: property?.petAllowed ? "Yes" : "No", unit: "", icon: LuPawPrint, },
    { label: "Available From", value: formateDate(property?.availableDate), unit: "", icon: LuCalendarCheck, },
    { label: "Lease Term", value: property?.leaseTermMonths, unit: "months", icon: LuClock, },
  ];

  return (
    <Box
      bg={{ base: "gray.50", _dark: "gray.950" }}
      minH="100vh"
      px={{ base: "3", sm: "5", lg: "8" }}
      py={{ base: "4", sm: "6" }}
    >
      <Stack direction="column" gap="5" maxW="7xl" mx="auto">
        {/* ── Breadcrumb ── */}
        <PropertyBreadcrumb title={property?.title} />

        {/* ── Hero Header ── */}
        <HeroHeader id={property?.id} title={property?.title} location={property?.locationAddress} propertyType={property?.propertyType} status={property?.status} rating={property?.rating} rentPrice={property?.baseRentPrice} />

        {/* ── Image Carousel ── */}
        <PropertyImageCarosel propertyImages={propertyImages} />

        {/* ── Main content grid ── */}
        <SimpleGrid
          columns={{ base: 1, lg: 3 }}
          gap="5"
          alignItems="flex-start"
        >
          {/* Left column */}
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <Stack gap="5">
              {/* Description */}
              <PropertyDescription description={property?.description} />

              {/* Key Details */}
              <KeyDetails keyDetails={keyDetails} />

              {/* Features & Connectivity */}
              <FeatureAndConnectivity appliances={appliances} internetName={property?.internetName} internetSpeed={property?.internetSpeed} nearTransitType={property?.nearTransitType} nearTransitDist={property?.nearTransitDist} />
            </Stack>
          </GridItem>

          {/* Right column — Landlord card & Map */}
          <GridItem colSpan={1}>
            {/* Landlord card */}
            <LandlordCard landlordName={property?.landlord?.username} landlordEmail={property?.landlord?.email} rentPrice={property?.baseRentPrice} profilePicture={property?.landlord?.profilePicture} />

            {/* Map */}
            <Box h={{ base: "52", sm: "64", md: "72" }} borderRadius="xl" overflow="hidden">
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={mapPosition} />
              </MapContainer>
            </Box>
          </GridItem>
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
