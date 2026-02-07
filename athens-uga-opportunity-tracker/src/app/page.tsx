import connectMongoDB from "../../lib/mongodb";
import LandingPage from "./splash/page";

export default function Page() {
  connectMongoDB();
  return <LandingPage />;
}