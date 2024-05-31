import { createLazyFileRoute } from "@tanstack/react-router";
import Test from "../Test";
import { App } from "../App";
import { Flex } from "@chakra-ui/react";

export const Route = createLazyFileRoute("/_auth/subscriptions")({
  component: Index,
});

function Index() {
  return <Flex p={8}>Subscriptions</Flex>;
}
