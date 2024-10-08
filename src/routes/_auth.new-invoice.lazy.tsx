import { createLazyFileRoute } from "@tanstack/react-router";
import Test from "../Test";
import { App } from "../App";
import { Flex } from "@chakra-ui/react";
import NewInvoice from "../screens/NewInvoice";

export const Route = createLazyFileRoute("/_auth/new-invoice")({
  component: Index,
});

function Index() {
  return <NewInvoice />;
}
