import {
  Box,
  Text,
  Stack,
  Avatar,
  HStack,
  Badge,
  Separator,
  Button,
  Flex,
  Icon,
  NativeSelect,
  For,
  Input,
} from "@chakra-ui/react";
import { SectionWrapper } from "./SectionWrapper";
import {
  LuMessageSquare,
  LuMail,
  LuPhone,
  LuCalendarCheck,
  LuPlus,
  LuX,
} from "react-icons/lu";
import { useAppStore } from "@/app/store";
import { useSocket } from "@/socket/useSocket";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Modal } from "@/components/ui/modal";
import { useMemo, useState } from "react";
import { MessageInput } from "@/features/chat/components/MessageInput";
import { useCreateBooking } from "@/features/property/hooks/useCreateBooking"

type Props = {
    landlordId: string;
    landlordName: string;
    landlordEmail: string;
    rentPrice: number;
    profilePicture?: string;
    propertyId: string;
}

function bookingDates () {
  const today = new Date();
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(
      date.toLocaleDateString("en-Us", { weekday: "short", month: "short", day: "numeric" })
    );
  }
  return dates;
}

const timeSlots = [ "09 AM", "10 AM", "11 AM", "12 PM", "01 PM", "02 PM", "03 PM", "04 PM", "05 PM" ];

export function LandlordCard({ landlordId, landlordName, landlordEmail, rentPrice, profilePicture, propertyId }: Props) {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [selectedDates, setSelectedDates] = useState<Record<"date" | "time", string>[]>([]);
  const [selectedDate, setSelectedDate] = useState<Record<"date" | "time", string>>({ date: "", time: "" });
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const user = useAppStore((s) => s.user);
  const chatList = useAppStore((s) => s.chatList);
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();
  const { mutate: createBooking } = useCreateBooking();

  const currentChat = useMemo(() => {
    return chatList?.find((chat) => chat.landlordId === landlordId && chat.tenantId === user?.id && chat.propertyId === propertyId);
  }, [chatList, landlordId, user?.id, propertyId]);

  const closeChatModal = () => setIsChatOpen(false);

  const closeBookingModal = () => {
    setIsBookingOpen(false);
    setSelectedDates([]);
    setSelectedDate({ date: "", time: "" });
  }

  function addDate() {
    if (selectedDates.length >= 3) {
      toast.warn("You can only select up to 3 dates.");
      return;
    }
    if (!selectedDate.date || !selectedDate.time) {
      toast.warn("Please select both a date and time.");
      return;
    }
    setSelectedDates([...selectedDates, selectedDate]);
    setSelectedDate({ date: "", time: "" });
  }

  function requestTour() {
    if (!user) {
      toast.warn("You need to be logged in to request a tour.");
      navigate("/login-register");
      return;
    }

    if (user.role === "LANDLORD") {
      toast.info("Landlords cannot request tours for properties.");
      return;
    }

    if (selectedDates.length < 0 && (!selectedDate.date || !selectedDate.time)) {
      toast.warn("Please select both a date and time.");
      return;
    }

    if (!phoneNumber.trim()) {
      toast.warn("Please enter your phone number.");
      return;
    }

    createBooking({
      landlordId,
      tenantId: user.id,
      propertyId,
      phoneNumber,
      schedules: selectedDates.length > 0 ? selectedDates : [selectedDate],
    }, {
      onSuccess: () => {
        toast.success("Tour request sent successfully!");
        closeBookingModal();
      }
    })
  }

  function joinChat () {
    if (!user) {
      toast.warn("You need to be logged in to contact the landlord.");
      navigate("/login-register");
      return;
    }

    if (user.role === "LANDLORD") {
      toast.info("Landlords cannot contact other landlords.");
      return;
    }

    if (landlordId === user.id) {
      toast.info("You can't start a chat about your own property.");
      return;
    }

    if (!socket || !isConnected) {
      socket?.connect();
      toast.info("Connecting to chat... please click again in a moment.");
      return;
    }

    if (!currentChat?.lastMessage) {
      setIsChatOpen(true);
      return;
    }

    socket.emit("join_chat", { landlordId, tenantId: user.id, propertyId });
    navigate("/tenant/chat");
  }

  function sendMessage(content: string) {
    if (!user) {
      toast.warn("You need to be logged in to send a message.");
      navigate("/login-register");
      return;
    }

    if (!socket || !isConnected) {
      socket?.connect();
      toast.info("Connecting to chat... please click again in a moment.");
      return;
    }

    if (!content.trim()) {
      toast.warn("Message cannot be empty.");
      return;
    }

    socket.emit(
      "join_chat",
      { landlordId, tenantId: user.id, propertyId },
      () => {
        socket.emit("send_message", content.trim());
        setIsChatOpen(false);
        navigate("/tenant/chat");
      }
    );
  }

  return (
    <Box>
      <SectionWrapper>
        <Stack gap="4">
          {/* Landlord */}
          <Text
            fontSize="xs"
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="widest"
            color="fg.muted"
          >
            Listed by
          </Text>

          <HStack gap="3">
            <Avatar.Root size="lg">
              <Avatar.Fallback name={landlordName} />
              <Avatar.Image
                src={`${import.meta.env.VITE_FILE_URL}/profile-images/${profilePicture}`}
              />
            </Avatar.Root>
            <Stack gap="0.5">
              <Text fontWeight="semibold" fontSize="sm">
                {landlordName}
              </Text>
              <Badge
                colorPalette="blue"
                variant="subtle"
                size="sm"
                borderRadius="full"
              >
                Verified Landlord
              </Badge>
            </Stack>
          </HStack>

          <Separator />

          {/* Contact info */}
          <Stack gap="2.5">
            <HStack gap="2.5" color="fg.muted">
              <Flex
                w="7"
                h="7"
                borderRadius="lg"
                bg="bg.subtle"
                align="center"
                justify="center"
                flexShrink={0}
              >
                <Icon as={LuMail} boxSize={3.5} />
              </Flex>
              <Text fontSize="sm">{landlordEmail}</Text>
            </HStack>
            <HStack gap="2.5" color="fg.muted">
              <Flex
                w="7"
                h="7"
                borderRadius="lg"
                bg="bg.subtle"
                align="center"
                justify="center"
                flexShrink={0}
              >
                <Icon as={LuPhone} boxSize={3.5} />
              </Flex>
              <Text fontSize="sm">+1 (555) 123-4567</Text>
            </HStack>
          </Stack>

          <Separator />

          {/* Price recap */}
          <Box
            bg="blue.50"
            _dark={{ bg: "blue.950" }}
            borderRadius="xl"
            p="4"
            textAlign="center"
          >
            <Text fontSize="xs" color="fg.muted" mb="0.5">
              Monthly rent
            </Text>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="blue.600"
              lineHeight="1.1"
            >
              MMK {rentPrice}
            </Text>
          </Box>

          {/* CTA buttons */}
          <Stack gap="2.5">
            <Button
              colorPalette="blue"
              borderRadius="xl"
              size="md"
              w="full"
              gap="2"
              onClick={() => setIsBookingOpen(true)}
            >
              <LuCalendarCheck size={15} />
              Request a Tour
            </Button>
            <Button
              variant="outline"
              borderRadius="xl"
              size="md"
              w="full"
              gap="2"
              onClick={joinChat}
            >
              <LuMessageSquare size={15} />
              Contact Landlord
            </Button>
          </Stack>

          <Text fontSize="xs" color="fg.muted" textAlign="center">
            Typically responds within 24 hours
          </Text>
        </Stack>
      </SectionWrapper>

      {/* modal for contacting landlord */}
      <Modal
        title="Contact Landlord"
        isOpen={isChatOpen}
        onClose={closeChatModal}
        size="xs"
      >
        <MessageInput onSend={sendMessage} />
      </Modal>

      {/* modal for booking a tour */}
      <Modal
        title="Request a Tour"
        isOpen={isBookingOpen}
        onClose={closeBookingModal}
        size="sm"
        closeOnInteractOutside={false}
        closeOnEsc={false}
      >
        <Text fontSize="sm" color="fg.muted" mb="3">
          Please select a date and time for your tour request. The landlord will
          be notified and will confirm the appointment.
        </Text>

        <Text fontWeight="semibold">You can choose up to 3 dates</Text>
        <Text fontSize="sm" color="fg.muted" mb="3">Tour times are in the listing's local time zone.</Text>

        <For each={selectedDates}>
          {(date, index) => (
            <HStack justify="space-between" mb="2" p="2" borderWidth="1px" borderRadius="md" borderColor="border.muted" bg="bg.muted" key={index}>
              <Text>{`${date.date} at ${date.time}`}</Text>
              <LuX onClick={() => setSelectedDates(prev => prev.filter((_, i) => i !== index))} />
            </HStack>
          )}
        </For>

        {selectedDates.length < 3 && (
          <HStack mt="3">
            <NativeSelect.Root size="sm" width="240px">
              <NativeSelect.Field
                placeholder="Select Date"
                value={selectedDate.date}
                onChange={(e) => setSelectedDate({ ...selectedDate, date: e.target.value })}
              >
                <For each={bookingDates()}>
                  {(date) => (
                    <option value={date}>{date}</option>
                  )}
                </For>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>

            <NativeSelect.Root size="sm" width="240px">
              <NativeSelect.Field
                placeholder="Select Time"
                value={selectedDate.time}
                onChange={(e) => setSelectedDate({ ...selectedDate, time: e.target.value })}
              >
                <For each={timeSlots}>
                  {(time) => (
                    <option value={time}>{time}</option>
                  )}
                </For>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </HStack>
        )}

        <Button size="xs" variant="outline" mt="3" onClick={addDate}>
          <LuPlus /> Date
        </Button>

        <Input placeholder="Enter phone number" mt="3" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

        <Button 
          colorPalette="blue" 
          mt="3" 
          w="full"
          onClick={requestTour}
        >
          Request
        </Button>
      </Modal>

    </Box>
  );
}

