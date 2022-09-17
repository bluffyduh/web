import { ApolloCache, gql } from "@apollo/client";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Icon, IconButton, Text } from "@chakra-ui/react";
import {
  PostsDocument,
  PostsQuery,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";

interface post {
  // post: {
  //   __typename?: "Posts" | undefined;
  //   creatorId: string;
  //   title: string;
  //   createdAt: string;
  //   id: string;
  //   points: number;
  //   updatedAt: string;
  //   discription: string;
  //   creator: {
  //     __typename?: "User" | undefined;
  //     username: string;
  //     id: string;
  //   };
  // };
  post: PostsQuery["posts"]["posts"][0];
  // variables: {
  //   limit: number | undefined;
  //   cursor: string | undefined;
  // };
}

export const Post = ({ post }: post) => {
  const [voteMutation, { data, loading }] = useVoteMutation({
    // refetchQueries: [
    //   { query: PostsDocument, variables: variables }, // DocumentNode object parsed with gql
    //   "Posts", // Query name
    // ],
  });

  const vote = async (num: number, postId: string) => {
    await voteMutation({
      variables: {
        postId,
        vote: num,
      },
      update: (cache) => {
        const data = cache.readFragment<{
          id: number;
          points: number;
          vote_status: number | null;
        }>({
          id: "Posts:" + postId,
          fragment: gql`
            fragment viewVote on Posts {
              id
              points
              vote_status
            }
          `,
        });

        if (data?.vote_status === num) {
          return;
        }

        const newPoint =
          (data?.points as number) + (!data?.vote_status ? 1 : 2) * num;

        cache.writeFragment({
          id: "Posts:" + postId,
          fragment: gql`
            fragment changeVote on Posts {
              vote_status
              points
            }
          `,
          data: {
            points: newPoint,
            vote_status: num,
          },
        });
      },
    });
  };

  // const readAndWriteFragments = (
  //   cache: ApolloCache<VoteMutation>,
  //   postId: string
  // ) => {
  //   const data = cache.readFragment<{
  //     id: number;
  //     points: number;
  //     voteStatus: number | null;
  //   }>({
  //     id: "Post:" + postId,
  //     fragment: gql`
  //       fragment _ on Post {
  //         id
  //         points
  //         voteStatus
  //       }
  //     `,
  //   });

  //   console.log(data?.points);
  // };

  return (
    <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
      <Box display={"flex"} flexDir={"column"} alignItems="center" mr={5}>
        <IconButton
          onClick={async () => {
            if (post.vote_status === 1) {
              return;
            }
            await vote(1, post.id);
          }}
          aria-label="Up vote"
          icon={<ChevronUpIcon />}
          isLoading={loading}
          colorScheme={post.vote_status === 1 ? "teal" : undefined}
        />
        <Box m={"5px 0"}>{post.points}</Box>
        <IconButton
          onClick={async () => {
            if (post.vote_status === -1) {
              return;
            }
            await vote(-1, post.id);
          }}
          aria-label="Down vote"
          icon={<ChevronDownIcon />}
          isLoading={loading}
          colorScheme={post.vote_status === -1 ? "red" : undefined}
        />
      </Box>
      <Box>
        <Heading fontSize="xl">{post.title}</Heading>
        <Text mt={4}>{post.discription}</Text>
      </Box>
    </Flex>
  );
};
