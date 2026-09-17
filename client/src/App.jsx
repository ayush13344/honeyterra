
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/layout/ScrollToTop.jsx";
import AnalyticsTracker from "./admin/components/AdminVisitors/AnalyticsTracker.jsx";

function App() {
  return (
    <>
      <AnalyticsTracker />
      <ScrollToTop />
      <AppRoutes />
    </>
  );
}

export default App;
