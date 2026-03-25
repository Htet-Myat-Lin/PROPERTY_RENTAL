import { Button, HStack, IconButton } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <HStack justify="center" gap="1" mt="2" pb="2">
      <IconButton
        aria-label="Previous"
        variant="ghost"
        size="sm"
        borderRadius="lg"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <LuChevronLeft />
      </IconButton>
      {pages.map((p) => (
        <Button
          key={p}
          size="sm"
          variant={p === page ? "solid" : "ghost"}
          colorPalette={p === page ? "blue" : "gray"}
          borderRadius="lg"
          minW="8"
          onClick={() => onPageChange(p)}
        >
          {p}
        </Button>
      ))}
      <IconButton
        aria-label="Next"
        variant="ghost"
        size="sm"
        borderRadius="lg"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <LuChevronRight />
      </IconButton>
    </HStack>
  );
}