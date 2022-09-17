import { Box } from "@chakra-ui/react";
import React from "react";

export type Variants = "medium" | "large";

interface WrapperProps {
  size?: Variants;
}

export const Wrapper: React.FC<WrapperProps> = ({ children, size }) => {
  return (
    <Box mt={8} maxW={size === "large" ? 800 : 400} mx="auto">
      {children}
    </Box>
  );
};
