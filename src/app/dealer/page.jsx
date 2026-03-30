import WholesaleStore from "@/components/b2b/WholesaleStore";
import B2bFooter from "@/components/Footer/B2bFooter";
import React from "react";

function page() {
  return (
    <>
      <WholesaleStore page="home" />
      <B2bFooter/>
    </>
  );
}

export default page;
