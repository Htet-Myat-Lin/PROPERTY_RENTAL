import { Dialog } from "@chakra-ui/react/dialog";

interface Props {
    title?: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    placement?: "center" | "top" | "bottom";
    size?: "xs" | "sm" | "md" | "lg";
    closeOnEsc?: boolean;
}

export const Modal = ({ title, isOpen, onClose, children, placement = "center", size = "md", closeOnEsc = true }: Props) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose} closeOnEscape={closeOnEsc} placement={placement} size={size}>
            <Dialog.Trigger />
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.CloseTrigger />
                    <Dialog.Header>
                        <Dialog.Title>
                            {title}
                        </Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        {children}
                    </Dialog.Body>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}