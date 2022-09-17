import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useResetPasswordMutation } from "../../generated/graphql";
import { ErrorDestructure } from "../../utils/errordestructure";
import { urqlClient } from "../../utils/urqlClient";
import NextLink from "next/link";
import { withApollo } from "../../utils/apolloClient";

const ResetPassword: NextPage = ({}) => {
  const router = useRouter();
  const [changePassword] = useResetPasswordMutation();
  const [tokenError, setTokenError] = useState("");

  return (
    <Wrapper size="medium">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (value, { setErrors }) => {
          console.log(value);
          const response = await changePassword({
            variables: {
              newPassword: value.newPassword,
              token: router.query.token as string,
            },
          });
          if (response.data?.resetPassword.error) {
            const error = ErrorDestructure(response.data.resetPassword.error);
            if ("token" in error) {
              setTokenError(error.token);
            }
            setErrors(error);
          } else if (response.data?.resetPassword.user) {
            // worked
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              label="newPassword"
              name="newPassword"
              placeholder="New Password"
            />

            {tokenError && (
              <Flex>
                <Box mr={2} textColor={"red"}>
                  {tokenError}
                </Box>
                <NextLink href="/forgot-password">
                  <Link>Forget Again</Link>
                </NextLink>
              </Flex>
            )}
            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Set New Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

// ResetPassword.getInitialProps = ({ query }) => {
//   return {
//     token: query.token as string,
//   };
// };

export default withApollo({})(ResetPassword);
