"use client";

import Wrapper from "@/components/Wrapper";

export default function MyApp() {
  return (
    <Wrapper title="Invoice Viewer">
      <iframe
        src="/invoice.pdf"
        width="100%"
        height="600px"
        title="PDF Viewer"
      ></iframe>
    </Wrapper>
  );
}
