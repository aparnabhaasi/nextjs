"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PageTitle from "@/components/PageTitle";
import Statistics from "./components/Statistics";

const AnalyticsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/sign-in"); // Redirect if not logged in
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;

  if (!session) return null; // Prevents flashing of protected content

  return (
    <>
      <PageTitle title="SinuSoidal Cyber Technologies" subName="Dashboard" />
      <Statistics />
    </>
  );
};

export default AnalyticsPage;
