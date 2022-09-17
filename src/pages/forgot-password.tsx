import { Box, Button, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { urqlClient } from "../utils/urqlClient";
import { withApollo } from "../utils/apolloClient";

interface Forgotpassword {}

const Forgotpassword: React.FC<Forgotpassword> = ({}) => {
  const [send, setSend] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();

  return (
    <Wrapper size="medium">
      <Formik
        initialValues={{ userORemail: "" }}
        onSubmit={async (value) => {
          await forgotPassword({ variables: value });
          setSend(true);
        }}
      >
        {({ isSubmitting }) =>
          send ? (
            <Flex justifyContent={"center"}>
              Check Your Mail for Reseting Password
            </Flex>
          ) : (
            <Form>
              <InputField
                label="userORemail"
                name="userORemail"
                placeholder="Username or Email"
              />

              <Button
                mt={4}
                type="submit"
                colorScheme="teal"
                isLoading={isSubmitting}
              >
                Forget Password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Forgotpassword);
