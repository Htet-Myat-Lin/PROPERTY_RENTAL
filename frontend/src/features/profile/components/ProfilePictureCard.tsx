import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    Flex,
    HStack,
    Icon,
    Text,
    VStack,
} from "@chakra-ui/react";import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { LuCamera, LuTrash2, LuUser } from "react-icons/lu";
import { useAppStore } from "@/app/store";
import { getApiErrorMessage } from "@/utils/api-error";
import { useProfilePicture } from "../hooks/useProfilePicture";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const profileImageUrl = (picture: string) =>
    `${import.meta.env.VITE_FILE_URL}/profile-images/${picture}`;

const formatRole = (role?: string) =>
    role ? role.charAt(0) + role.slice(1).toLowerCase() : "Member";

export function ProfilePictureCard() {
    const user = useAppStore((s) => s.user);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { upload, remove } = useProfilePicture();
    const [error, setError] = useState<string | null>(null);

    const isBusy = upload.isPending || remove.isPending;

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please choose an image file");
            return;
        }
        if (file.size > MAX_IMAGE_SIZE) {
            setError("Image must be smaller than 5 MB");
            return;
        }

        upload.mutate(file, {
            onError: (err) => setError(getApiErrorMessage(err, "Could not upload your profile picture")),
        });
    };

    const handleRemove = () => {
        setError(null);
        remove.mutate(undefined, {
            onError: (err) => setError(getApiErrorMessage(err, "Could not remove your profile picture")),
        });
    };

    return (
        <Card.Root
            width="100%"
            bg="bg.panel"
            borderWidth="1px"
            borderColor="border.muted"
            borderRadius="2xl"
            overflow="hidden"
            shadow="md"
            _dark={{ shadow: "none" }}
        >
            <Card.Body px={5} py={6}>
                <VStack gap={4} align="stretch">
                    {error && (
                        <Alert.Root status="error" variant="subtle" borderRadius="md" role="alert">
                            <Alert.Indicator />
                            <Alert.Content>
                                <Alert.Description>{error}</Alert.Description>
                            </Alert.Content>
                        </Alert.Root>
                    )}

                    <VStack gap={3}>
                        <Avatar.Root size="2xl">
                            {user?.profilePicture && (
                                <Avatar.Image src={profileImageUrl(user.profilePicture)} alt={user.username} />
                            )}
                            <Avatar.Fallback name={user?.username} fontSize="xl" fontWeight="semibold" />
                        </Avatar.Root>

                        <VStack gap={1} align="center" textAlign="center">
                            <Text fontWeight="semibold" color="fg" fontSize="lg">
                                {user?.username || "User"}
                            </Text>
                            <HStack gap={2}>
                                <Text fontSize="xs" color="fg.muted">
                                    {formatRole(user?.role)}
                                </Text>
                                {user?.isEmailVerified ? (
                                    <Text fontSize="xs" color="green.600" _dark={{ color: "green.300" }}>
                                        • Verified
                                    </Text>
                                ) : (
                                    <Text fontSize="xs" color="orange.500">• Unverified</Text>
                                )}
                            </HStack>
                            <Text fontSize="xs" color="fg.muted" lineClamp={1}>
                                {user?.email}
                            </Text>
                        </VStack>
                    </VStack>

                    <Box>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/gif,image/webp,image/apng"
                            hidden
                            onChange={handleFileChange}
                        />
                        <HStack gap={2}>
                            <Button
                                size="sm"
                                colorPalette="blue"
                                borderRadius="lg"
                                gap={2}
                                flex={1}
                                disabled={isBusy}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Icon as={LuCamera} boxSize={4} />
                                {user?.profilePicture ? "Change photo" : "Upload photo"}
                            </Button>
                            {user?.profilePicture && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    colorPalette="red"
                                    borderRadius="lg"
                                    gap={2}
                                    loading={remove.isPending}
                                    disabled={isBusy}
                                    onClick={handleRemove}
                                >
                                    <Icon as={LuTrash2} boxSize={4} />
                                    Remove
                                </Button>
                            )}
                        </HStack>
                    </Box>

                    <Flex
                        align="flex-start"
                        gap={2}
                        px={3}
                        py={2.5}
                        borderRadius="md"
                        bg="bg.subtle"
                        color="fg.muted"
                        fontSize="xs"
                    >
                        <Icon as={LuUser} boxSize={4} mt="1px" flexShrink={0} />
                        <Text>Use a clear photo of yourself. PNG or JPG up to 5 MB.</Text>
                    </Flex>
                </VStack>
            </Card.Body>
        </Card.Root>
    );
}
