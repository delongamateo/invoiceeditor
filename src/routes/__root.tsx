import { Flex, Spacer } from "@chakra-ui/react";
import {
  createRootRoute,
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { AuthContextType } from "../hooks/useAuth";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Footer from "../components/footer";

interface MyRouterContext {
  auth: AuthContextType;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      {/* <TanStackRouterDevtools position="bottom-right" /> */}
      <Outlet />
    </>
  ),
});
