import { Box } from "@chakra-ui/react";
import { ChatList } from "./ChatList";

export function SideBar() {
    return (
        <Box
            h="full"
            minH="0"
            display="flex"
            flexDirection="column"
            bg="bg.panel"
        >
            <ChatList />
        </Box>
    );
}
