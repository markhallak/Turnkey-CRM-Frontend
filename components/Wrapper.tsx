import React, { FC } from "react";
import Header from "./Header";

interface IProps {
  children: React.ReactNode;
  title: string;
}

const Wrapper: FC<IProps> = ({ children, title }) => {

  return (
    <div className="flex min-h-screen">

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header title={title} />
        <div className="w-full mx-0 sm:mx-0 lg:mx-0 px-4 sm:px-16 lg:px-16">{children}</div>
      </div>
    </div>
  );
};

export default Wrapper;
