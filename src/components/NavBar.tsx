import { useApolloClient } from "@apollo/client";
import {
  Box,
  Button,
  Flex,
  Link,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeCheckQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

export const NavBar = () => {
  const { loading, data } = useMeCheckQuery({
    skip: isServer(),
  });
  const [logoutMutation, { loading: isLoading }] = useLogoutMutation();
  const apollo = useApolloClient();
  let navBody = null;

  if (loading) {
    // if fetching, show loading
  } else if (!data?.me) {
    navBody = (
      <>
        <NextLink href="/login">
          <Button as={"a"} fontSize={"sm"} fontWeight={400} variant={"link"}>
            Login
          </Button>
        </NextLink>
        <NextLink href="/register">
          <Button
            display={{ base: "none", md: "inline-flex" }}
            fontSize={"sm"}
            fontWeight={600}
            color={"white"}
            bg={"pink.400"}
            _hover={{
              bg: "pink.300",
            }}
          >
            Sign Up
          </Button>
        </NextLink>
      </>
    );
  } else {
    navBody = (
      <Flex alignItems={"center"}>
        <NextLink href="/create-post">
          <Button
            colorScheme="teal"
            _hover={{
              bg: "pink.300",
            }}
            mr={10}
          >
            create post
          </Button>
        </NextLink>

        <Text fontWeight={800} fontSize={"2xl"}>
          {data.me.username}
        </Text>

        <Button
          variant="link"
          onClick={async () => {
            await logoutMutation();
            await apollo.resetStore();
          }}
          ml={2}
          isLoading={isLoading}
          fontSize={"2xl"}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Box position="sticky" top="0" zIndex={1}>
      <Flex
        bg={useColorModeValue("tan", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "white")}
            fontWeight={800}
            fontSize={"5xl"}
            ml={120}
          >
            <NextLink href="/">lireddit</NextLink>
          </Text>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
          mr={120}
        >
          {navBody}
        </Stack>
      </Flex>
    </Box>
  );
};
