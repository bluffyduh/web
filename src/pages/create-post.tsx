import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { authUser } from "../utils/authUser";
import { withApollo } from "../utils/apolloClient";

const CratePost: React.FC<{}> = ({}) => {
  const [createPost] = useCreatePostMutation();
  const router = useRouter();
  authUser();

  return (
    <Layout size="large">
      <Formik
        initialValues={{ title: "", discription: "" }}
        onSubmit={async (value) => {
          console.log(value);
          const { errors } = await createPost({
            variables: {
              input: value,
            },
            update: (cache) => {
              cache.evict({ fieldName: "posts" });
            },
          });
          console.log(errors);
          if (!errors) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField label="title" name="title" placeholder="Title" />
            <Box mt={4}>
              <InputField
                textarea
                label="discription"
                name="discription"
                placeholder="text..."
              />
              <Button
                mt={4}
                type="submit"
                colorScheme="teal"
                isLoading={isSubmitting}
              >
                create post
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CratePost);
