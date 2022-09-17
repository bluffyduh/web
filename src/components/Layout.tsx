import React from "react";
import { NavBar } from "./NavBar";
import { Variants, Wrapper } from "./Wrapper";

interface LayoutProps {
  size: Variants;
}

export const Layout: React.FC<LayoutProps> = ({ children, size }) => {
  return (
    <div>
      <NavBar />
      <Wrapper size={size}>{children}</Wrapper>
    </div>
  );
};
