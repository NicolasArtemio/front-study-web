import type { RouteObject } from "react-router-dom";
import Home from "../pages/Home";
import LogPage from "../pages/LogPage";
import { RecommendationPage } from "../pages/RecommendationPage";
import { MistakesPage } from "../pages/MistakesPage";
import VocabularyPage from "../pages/VocabularyPage";
import NotFoundPage from "../pages/NotFoundPage";
import SingleLogPage from "../pages/SingleLogPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/logs",
    element: <LogPage />,
  },
  {
    path: "/recommendations",
    element: <RecommendationPage />,
  },
  {
    path: "/mistakes",
    element: <MistakesPage />,
  },
  {
    path: "/vocabulary",
    element: <VocabularyPage />,
  },
  {
    path: "/logs/:id",
    element: <SingleLogPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

