import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import DashboardVisitor from "../views/sandbox/DashboardVisitor";
export default function IndexRouter(props) {
  return (
    <Routes>
      <Route path="/" element={<DashboardVisitor />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
