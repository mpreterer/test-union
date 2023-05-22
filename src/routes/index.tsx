import { Route, Routes } from "react-router-dom";

import { Layout } from "../components/Layout/Layout";
import { NotFoundPage } from "../pages/NotFoundPage/NotFoundPage";
import TeamPage from "../pages/TeamPage/TeamPage";

import { SCREENS } from "./endpoints";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path={SCREENS.TEAM_PAGE} element={<TeamPage />} />
        <Route path={SCREENS.NOT_FOUND} element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export { AppRoutes };
