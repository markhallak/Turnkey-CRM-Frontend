import Link from "next/link";
import React from "react";

interface CustomLinkProps {
  href: string;
  children: React.ReactNode;
  [key: string]: any;
}

export function LinkWrapper({ href, children, ...props }: CustomLinkProps) {
  const isLogin = href === "/login";
  return (
    <Link href={href} {...props} legacyBehavior>
      <a {...(!isLogin ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    </Link>
  );
}

export default LinkWrapper;
