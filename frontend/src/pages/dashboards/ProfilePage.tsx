import { Box, Grid, Stack, Text } from "@chakra-ui/react";
import { ChangePasswordForm } from "@/features/profile/components/ChangePasswordForm";
import { ProfileDetailsForm } from "@/features/profile/components/ProfileDetailsForm";
import { ProfilePictureCard } from "@/features/profile/components/ProfilePictureCard";

export function ProfilePage() {
    return (
        <Stack gap={{ base: 5, md: 7 }}>
            <Box>
                <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="fg">
                    Profile
                </Text>
                <Text color="fg.muted" fontSize="sm" mt={1}>
                    Manage your photo, personal details, and account password in one place.
                </Text>
            </Box>

            <Grid
                templateColumns={{ base: "1fr", lg: "minmax(0, 340px) minmax(0, 1fr)" }}
                gap={{ base: 4, md: 5 }}
                alignItems="start"
            >
                <ProfilePictureCard />

                <Stack gap={{ base: 4, md: 5 }} w="full">
                    <ProfileDetailsForm />
                    <ChangePasswordForm />
                </Stack>
            </Grid>
        </Stack>
    );
}
