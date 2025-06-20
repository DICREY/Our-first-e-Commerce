import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import user1 from "../../../assets/images/profile/user-1.jpg";
import user2 from "../../../assets/images/profile/user-2.jpg";
import user3 from "../../../assets/images/profile/user-3.jpg";
import user4 from "../../../assets/images/profile/user-4.jpg";
// import { Icon } from "@iconify/react";

const Notifications = [
    {
        id:1,
        title:"Received Order from John Doe of $385.90",
        user:user1
    },
    {
        id:2,
        title:"Received Order from Jessica Williams of $249.99",
        user:user2
    },
    {
        id:3,
        title:"Received Order from John Edison of $499.99",
        user:user3
    },
    {
        id:4,
        title:"Received message from Nitin Chohan",
        user:user4
    },
];

const Notification = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef();

    // Cierra el menú si se hace click fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative group/menu" ref={menuRef}>
            <span
                className="h-10 w-10 hover:text-primary group-hover/menu:bg-lightprimary group-hover/menu:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer relative"
                aria-label="Notifications"
                onClick={() => setOpen((prev) => !prev)}
            >
                {/* <Icon icon="solar:bell-linear" height={20} /> */}
                <span className="h-2 w-2 rounded-full absolute end-2 top-1 bg-primary p-0"></span>
            </span>
            {open && (
                <div className="absolute right-0 mt-2 w-[300px] bg-white dark:bg-darkgray rounded-sm shadow-lg z-50 notification">
                    {Notifications.map((item) => (
                        <Link
                            key={item.id}
                            to="#"
                            className="px-3 py-3 flex items-center bg-hover group/link w-full gap-3 text-dark hover:bg-gray-100"
                        >
                            <div className="flex items-center gap-5">
                                <div>
                                    <img
                                        src={item.user}
                                        alt="user"
                                        width={40}
                                        height={40}
                                        className="rounded-full shrink-0"
                                    />
                                </div>
                                <p className="text-dark opacity-80 text-[13px] font-semibold">{item.title}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notification;