"use client"
import { CirclesWithBar } from "react-loader-spinner";
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <CirclesWithBar
  height="100"
  width="100"
  color="#4fa94d"
  outerCircleColor="#4fa94d"
  innerCircleColor="#4fa94d"
  barColor="#4fa94d"
  ariaLabel="circles-with-bar-loading"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
  />
    </div>
  );
}
