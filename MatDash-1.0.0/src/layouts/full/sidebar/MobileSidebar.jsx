// Librarys
import React from "react";
import SimpleBar from "simplebar-react";

// Imports 
import SidebarContent from "./Sidebaritems";
import NavItems from "./NavItems";
import FullLogo from "../shared/logo/FullLogo";
import Upgrade from "./Upgrade";

// Import styles 
import 'simplebar-react/dist/simplebar.min.css';

// Component 
const MobileSidebar = () => {
  return (
    <aside
      className="fixed menu-sidebar pt-0 bg-white dark:bg-darkgray transition-all h-full w-72 z-50"
      aria-label="Sidebar with multi-level dropdown example"
    >
      <div className="px-5 py-4 pb-7 flex items-center sidebarlogo">
        <FullLogo />
      </div>
      <SimpleBar className="h-[calc(100vh_-_242px)]">
        <nav className="px-5 mt-2">
          <ul className="sidebar-nav hide-menu">
            {SidebarContent &&
              SidebarContent.map((item, index) => (
                <li className="caption mb-4" key={item.heading}>
                  <h5 className="text-link dark:text-white/70 caption font-semibold leading-6 tracking-widest text-xs pb-2 uppercase">
                    {item.heading}
                  </h5>
                  <ul>
                    {item.children?.map((child, idx) => (
                      <li key={child.id || idx}>
                        <NavItems item={child} />
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
          </ul>
        </nav>
      </SimpleBar>
      <Upgrade />
    </aside>
  );
};

export default MobileSidebar;