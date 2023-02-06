import React from "react";
import { FormsMain } from "../components/Forms/FormsMain";
import { Header } from "../components/Header";

export default function Forms() {
  return (
    <Box>
      <Header />
      <FormsMain />
    </Box>
  );
}

function Box(props: React.PropsWithChildren) {
  return <div className="flex h-full flex-col" {...props} />;
}
