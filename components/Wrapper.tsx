"use client"

import React, { FC, useEffect, useRef, useState } from "react";
import Header from "./Header";
import WrapperContext, { WrapperData } from "@/lib/wrapperContext";
import Loading from "./Loading";
import { AnimatePresence, motion } from 'framer-motion';
import {
  getNotifications,
  getProfileDetails,
  type ProfileDetails,
  fetchWithRetry,
} from "@/components/Header";

interface IProps {
  children: React.ReactNode;
  title: string;
  initialChildLoading?: boolean;
}

const Wrapper: FC<IProps> = ({ children, title, initialChildLoading = false }) => {
  const [userData, setUserData] = useState({
    notifications: [] as WrapperData["notifications"],
    userName: "",
    avatarColor: "#000000",
  });
  const [childLoading, setChildLoadingState] = useState(false);
  const loadingCount = useRef(0);
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

    const fallbackColor = "#000000";

    setChildLoading(true);
    Promise.allSettled([
      fetchWithRetry(() => getNotifications(10)),
      fetchWithRetry(() => getProfileDetails()),
    ])
      .then(([nRes, pRes]) => {
        const profile: ProfileDetails =
          pRes.status === "fulfilled"
            ? pRes.value
            : { firstName: "A", hexColor: fallbackColor };

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


        setUserData({
          notifications,
          userName: profile.firstName,
          avatarColor: profile.hexColor,
        });

      })
      .catch(() => {
        setUserData({
          notifications: [],
          userName: "A",
          avatarColor: fallbackColor,
        });
      })
      .finally(() => setChildLoading(false));
  }, []);


  return (
    <WrapperContext.Provider value={{
        notifications: userData.notifications,
        userName: userData.userName,
        avatarColor: userData.avatarColor,
        setChildLoading,
        childLoading,
      }}>
      <div className="flex min-h-screen">
    <div className={`flex-1 flex flex-col ${
    childLoading ? 'overflow-hidden' : 'overflow-y-auto'}`}>
      <Header title={title} />

      <div className="relative overflow-hidden w-full px-4 sm:px-16 lg:px-16">
      <AnimatePresence>
  {childLoading && (
    <motion.div
      key="loading-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 flex items-center justify-center bg-[hsl(0_0%_98%)] z-50"
    >
      <Loading />
    </motion.div>
  )}
</AnimatePresence>
        {children}

      </div>
    </div>
  </div>
    </WrapperContext.Provider>
  );
};

export default Wrapper;
