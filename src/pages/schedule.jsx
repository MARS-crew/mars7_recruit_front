import Nobackheader from "../components/nobackheader";
import BottomNavBar from "../components/BottomNavBar";

export default function Schedule() {
  return (
    <div style={{ height: "100vh" }}>
      <Nobackheader title="학사일정" />

      <iframe
        src="https://www.dongyang.ac.kr/dmu/4749/subview.do"
        title="학사일정"
        style={{
          width: "100%",
          height: "calc(100vh - 56px)",
          border: "none",
        }}
      />
      <BottomNavBar/>
    </div>
  );
}