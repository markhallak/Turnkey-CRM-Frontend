import React, { FC, useEffect, useRef, useState } from "react";
import Header from "./Header";
import WrapperContext, { WrapperData } from "@/lib/wrapperContext";
import Loading from "./Loading";
import {
  getNotifications,
  getProfileDetails,
  type ProfileDetails,
  fetchWithRetry,
} from "@/lib/api";

interface IProps {
  children: React.ReactNode;
  title: string;
  initialChildLoading?: boolean;
}

const Wrapper: FC<IProps> = ({ children, title, initialChildLoading = false }) => {
  const [data, setData] = useState<WrapperData | null>(null);
  const [childLoading, setChildLoadingState] = useState(initialChildLoading);
  const loadingCount = useRef(initialChildLoading ? 1 : 0);
  const setChildLoading = (loading: boolean) => {
    if (loading) {
      loadingCount.current += 1;
    } else {
      loadingCount.current = Math.max(0, loadingCount.current - 1);
    }
    setChildLoadingState(loadingCount.current > 0);
  };
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const userId = process.env.NEXT_PUBLIC_DEFAULT_USER_ID ?? "";
    const getColor = () => `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")}`;

    setChildLoading(true);
    Promise.allSettled([
      fetchWithRetry(() => getNotifications(10)),
      fetchWithRetry(() => getProfileDetails(userId)),
    ])
      .then(([nRes, pRes]) => {
        const profile: ProfileDetails =
          pRes.status === "fulfilled"
            ? pRes.value
            : { firstName: "A", hexColor: getColor() };

        const notifications =
          nRes.status === "fulfilled"
            ? nRes.value.notifications.map((n) => ({
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
              }))
            : [];


        setData({
          notifications,
          userName: profile.firstName,
          avatarColor: profile.hexColor,
          setChildLoading,
          childLoading
        });

      })
      .catch(() => {
        const color = getColor();
        setData({
          notifications: [],
          userName: "A",
          avatarColor: color,
          setChildLoading,
          childLoading
        });
      })
      .finally(() => setChildLoading(false));
  }, []);

  if (!data || childLoading) return <Loading />;

  return (
    <WrapperContext.Provider value={{ ...data, childLoading }}>
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
