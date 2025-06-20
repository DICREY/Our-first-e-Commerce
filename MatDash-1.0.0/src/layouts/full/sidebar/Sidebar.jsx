// Librarys 
import React from 'react';
import SimpleBar from 'simplebar-react';

// Imports
import FullLogo from '../shared/logo/FullLogo';
import NavItems from './NavItems';
import SidebarContent from './Sidebaritems';

// Component
const SidebarLayout = () => {
  return (
    <>
      <div className="xl:block hidden">
        <aside
          className="fixed menu-sidebar bg-white dark:bg-darkgray rtl:pe-4 rtl:ps-0"
          aria-label="Sidebar with multi-level dropdown example"
        >
          <div className="px-6 py-4 flex items-center sidebarlogo">
            <FullLogo />
          </div>
          <SimpleBar className="h-[calc(100vh_-_230px)]">
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
        </aside>
      </div>
    </>
  );
};

export default SidebarLayout;