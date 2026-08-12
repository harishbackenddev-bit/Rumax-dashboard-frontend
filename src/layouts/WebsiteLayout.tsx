import { Outlet } from "react-router-dom";
import Header from "@/components/Header/Header";
import MainFooter from "@/components/Footer/MainFooter";

const WebsiteLayout = () => {
  return (
    <>
      <Header />
      <main className="flex-1 pt-0 website">
        <div className="bg-white">
          <Outlet />
        </div>
      </main>
      <MainFooter />
    </>
  );
};

export default WebsiteLayout;