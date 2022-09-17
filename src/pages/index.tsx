import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { urqlClient } from "../utils/urqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { withApollo } from "../utils/apolloClient";
import { MutableRefObject, useRef } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Post } from "../components/post";

const Index = () => {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: { limit: 10, cursor: null },
    notifyOnNetworkStatusChange: true,
  });

  const onScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // console.log(data?.posts.posts);

  return (
    <Layout size="large">
      {/* <div ref={reff} onScroll={onScroll}> */}
      <div>Post show here</div>
      {!data && loading ? (
        <div>loading../</div>
      ) : (
        <div>
          {/* <InfiniteScroll
            pageStart={1}
            loadMore={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data?.posts.posts[data.posts.posts.length - 1].createdAt,
                },
              });
            }}
            hasMore={data?.posts.hasMore}
            loader={
              <Box m="auto" my={8} key={0}>
                Loading ...
              </Box>
            }
          > */}
          <Stack spacing={8}>
            {data!.posts.posts.map((post) => (
              <Post post={post} />
            ))}
          </Stack>
          {/* </InfiniteScroll> */}
          <Button onClick={onScroll} position="fixed" bottom={0} right={0}>
            click here
          </Button>
        </div>
      )}

      {data ? (
        <Flex>
          <Button
            m="auto"
            my={8}
            isLoading={loading}
            onClick={() =>
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
              })
            }
          >
            Load More
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
