import { Breadcrumb, Link as ChakraLink } from "@chakra-ui/react";
import { Link } from "react-router";

export function PropertyBreadcrumb({ title } : { title: string }) {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Link to="/">
            <ChakraLink fontSize="sm">Home</ChakraLink>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Link to="/properties">
            <ChakraLink fontSize="sm">Properties</ChakraLink>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.CurrentLink fontSize="sm">
            {title}
          </Breadcrumb.CurrentLink>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}
