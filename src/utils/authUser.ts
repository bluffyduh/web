import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeCheckQuery } from "../generated/graphql";

export const authUser = () => {
  const { data, loading } = useMeCheckQuery();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !data?.me) {
      router.replace("/login?next=" + router.pathname);
    }
  }, [data, loading, router]);
};
