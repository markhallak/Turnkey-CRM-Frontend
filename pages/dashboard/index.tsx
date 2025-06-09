import CalendarComponent from "@/components/Dashboard/CalenderComponent";
import Performance from "@/components/Dashboard/Performance";
import Wrapper from "@/components/Wrapper";
import { LuCircleUserRound } from "react-icons/lu";

const notifications = [
  {
    title: "Logged in as Administrator",
    date: "2025-02-19T04:07:12.000Z",
    author: "Kevin Smith",
  },
  {
    title: "New project created",
    date: "2025-02-19T04:07:12.000Z",
    author: "Jane Doe",
  },
  {
    title: "Project updated",
    date: "2025-02-19T04:07:12.000Z",
    author: "Michael Johnson",
  },
  {
    title: "Project deleted",
    date: "2025-02-19T04:07:12.000Z",
    author: "John Doe",
  },
];

export default function Dashboard() {
  return (
    <Wrapper title="dashboard">
    <div className="px-6 sm:px-0 md: px-0 lg:px-0">
      <div className="flex flex-col lg:flex-row py-8 gap-10">
      <style jsx global>{`
        .title {
          font-family: "Times New Roman", serif;
          text-transform: capitalize;
          color: #0b1f3a;
        }
      `}</style>
        <div className="flex-1 min-w-0">
          <CalendarComponent />
        </div>
        <div className="md:col-span-1">
          <Performance />
        </div>
      </div>
      <div className="flex flex-col py-4 pb-20">
        <span className="text-2xl title">Latest Updates</span>

        <ul className="mt-5 space-y-1">
          {notifications.map((notification, index) => (
            <li
              key={index}
              className="py-3 px-5 border rounded-lg border-gray-300 text-gray-800 font-medium grid grid-cols-2 md:grid-cols-3 
                       transition-colors duration-200 hover:bg-gray-100 group"
            >
              <span className="text-sm">{notification.title}</span>
              <div className="items-center hidden md:flex">
                <LuCircleUserRound size={22} />
                <span className="ml-3 text-sm">{notification.author}</span>
              </div>
              <span className="text-sm text-gray-600 text-right">
                {new Date(notification.date).toDateString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
      </div>
    </Wrapper>
  );
}
