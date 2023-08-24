import dynamic from "next/dynamic";
const PlotComp = dynamic(() => import("../pages/plot"), { ssr: false });
const Home = () => {
  return (
    <>
      <PlotComp />
    </>
  );
};

export default Home;