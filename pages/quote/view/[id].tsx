"use client";

import Wrapper from "@/components/Wrapper";

export default function ViewQuote() {
  return (
    <Wrapper title="PDF Viewer">
      <iframe
        src="/quote.pdf"
        width="100%"
        height="600px"
        title="PDF Viewer"
      ></iframe>
    </Wrapper>
  );
}
