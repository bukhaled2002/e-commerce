import Header from "../components/Header";
import { Outlet } from "react-router";

function RootPage() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default RootPage;
