import React from "react";
import { Form, Formik } from "formik";
import { Box, Button } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { ErrorDestructure } from "../utils/errordestructure";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { urqlClient } from "../utils/urqlClient";
import { withApollo } from "../utils/apolloClient";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [register] = useRegisterMutation();

  return (
    <Wrapper size="medium">
      <Formik
        initialValues={{ email: "", username: "", password: "" }}
        onSubmit={async (value, { setErrors }) => {
          console.log(value);
          const response = await register({
            variables: {
              registerOptions: value,
            },
          });
          // console.log(response);
          if (response.data?.register.error) {
            console.log(response.data.register.error);
            setErrors(ErrorDestructure(response.data.register.error));
          } else if (response.data?.register.user) {
            // worked
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField label="email" name="email" placeholder="Eamil" />
            <Box mt={4}>
              <InputField
                label="username"
                name="username"
                placeholder="Username"
              />
            </Box>
            <Box mt={4}>
              <InputField
                label="password"
                name="password"
                placeholder="Password"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Register);
