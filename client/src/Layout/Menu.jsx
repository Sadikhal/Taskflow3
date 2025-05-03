import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { FaTasks } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import { GiProgression } from "react-icons/gi";
import { GrCompliance } from "react-icons/gr";

const menuItems = [
  {
    title: "FILTER TASKS",
    items: [
      {
        icon: <FaTasks />,
        label: "All Tasks",
        status: "all",
      },
      {
        icon: <MdOutlinePendingActions />,
        label: "Pending",
        status: "pending",
      },
      {
        icon: <GiProgression />,
        label: "In-Progress",
        status: "in-progress",
      },
      {
        icon: <GrCompliance />,
        label: "Completed",
        status: "completed",
      },
    ],
  },
];

const Menu = ({ open }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentStatus = searchParams.get("status") || "all";

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>
          {section.items.map((item) => (
            <Link
              key={item.status}
              to={`?status=${item.status}`}
              className={cn(
                "flex items-center gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight text-sm ",
                open ? "justify-start" : "justify-center lg:justify-start",
                currentStatus === item.status && "bg-teal-800 text-[#ffff]"
              )}
            >
              <div className="object-contain h-65w-5 mt-[1px]">{item.icon}</div>
              <span className={cn("lg:block", open ? "block" : "hidden")}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
