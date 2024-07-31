import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router";

function ProtectCustomerRoute() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (user.role === "customer") {
    return <Outlet />;
  } else {
    navigate("/", { replace: true });
    return null;
  }
}
export default ProtectCustomerRoute;
