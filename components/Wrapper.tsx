import React, { FC, useEffect, useRef, useState } from "react";
import Header from "./Header";
import WrapperContext, { WrapperData } from "@/lib/wrapperContext";
import {
  getNotifications,
  getProfileDetails,
  type ProfileDetails,
} from "@/lib/api";

interface IProps {
  children: React.ReactNode;
  title: string;
}

const Wrapper: FC<IProps> = ({ children, title }) => {
  const [data, setData] = useState<WrapperData | null>(null);

  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const userId = process.env.NEXT_PUBLIC_DEFAULT_USER_ID;
    const getColor = () => `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")}`;

    Promise.all([
      getNotifications(10),
      userId
        ? getProfileDetails(userId)
        : Promise.resolve({ firstName: "A", hexColor: getColor() } as ProfileDetails),
    ])
      .then(([nRes, profile]) => {
        const notifications = nRes.notifications.map((n) => ({
          id: n.id,
          message: n.message,
          time: new Date(n.createdAt).toLocaleString(),
          unread: true,
          avatar: (
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-white text-base font-medium cursor-pointer"
              style={{ backgroundColor: profile.hexColor }}
            >
              <span className="-mt-[2px]">{profile.firstName.charAt(0)}</span>
            </div>
          ),
        }));
        setData({
          notifications,
          userName: profile.firstName,
          avatarColor: profile.hexColor,
        });
      })
      .catch(() => {
        const color = getColor();
        setData({
          notifications: [],
          userName: "A",
          avatarColor: color,
        });
      });
  }, []);

  if (!data) return <div className="p-4">Loading...</div>;

  return (
    <WrapperContext.Provider value={data}>
      <div className="flex min-h-screen">
        <div className="flex-1 flex flex-col overflow-y-auto">
          <Header title={title} />
          <div className="w-full mx-0 sm:mx-0 lg:mx-0 px-4 sm:px-16 lg:px-16">
            {children}
          </div>
        </div>
      </div>
    </WrapperContext.Provider>
  );
};

export default Wrapper;
