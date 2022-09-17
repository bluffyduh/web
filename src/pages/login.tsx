import React from "react";
import { Form, Formik } from "formik";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import {
  MeCheckDocument,
  MeCheckQuery,
  useLoginMutation,
} from "../generated/graphql";
import { ErrorDestructure } from "../utils/errordestructure";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { urqlClient } from "../utils/urqlClient";
import NextLink from "next/link";
import { withApollo } from "../utils/apolloClient";

interface registerProps {}

const Login: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();
  return (
    <Wrapper size="medium">
      <Formik
        initialValues={{ emailORusername: "", password: "" }}
        onSubmit={async (value, { setErrors }) => {
          const response = await login({
            variables: value,
            update: (cache, { data }) => {
              cache.writeQuery<MeCheckQuery>({
                query: MeCheckDocument,
                data: {
                  __typename: "Query",
                  me: data?.login.user,
                },
              });

              cache.evict({ fieldName: "posts:{}" });
            },
          });
          if (response.data?.login.error) {
            setErrors(ErrorDestructure(response.data.login.error));
          } else if (response.data?.login.user) {
            // worked
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              label="username/email"
              name="emailORusername"
              placeholder="Username or Email"
            />
            <Box mt={4}>
              <InputField
                label="password"
                name="password"
                placeholder="Password"
                type="password"
              />
              <Flex>
                <Button
                  mt={4}
                  type="submit"
                  colorScheme="teal"
                  isLoading={isSubmitting}
                >
                  Login
                </Button>
                <NextLink href="/forgot-password">
                  <Link ml="auto" mt={4}>
                    Forget Password?
                  </Link>
                </NextLink>
              </Flex>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Login);
