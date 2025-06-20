import { Link } from "react-router";
import UpgradePlan from "../../../assets/images/backgrounds/upgrade.png";

const Upgrade = () => {
  return (
    <>
      <div className="px-5 mt-2 relative">
        <div className="bg-lightprimary py-4 px-5 rounded-xl ">
          <div className="grid grid-cols-12">
            <div className="col-span-7">
              <h6 className="text-base text-dark">Upgrade to pro</h6>
              <a
                href="https://adminmart.com/product/matdash-tailwind-react-admin-template/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-dark transition"
              >
                Buy Pro
              </a>
              {/* 
              Si prefieres usar <Link> para navegación interna:
              <Link
                to="/ruta-interna"
                className="mt-3 inline-block bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-dark transition"
              >
                Buy Pro
              </Link>
              */}
            </div>
            <img src={UpgradePlan} alt="upgrade" className="absolute h-24 w-24 end-0" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Upgrade;