import React from "react";
import rolesManager from "@/constants/RolesManager";

const ProtectedLayout = ({ requiredRole, session, children }) => {
  return rolesManager.hasRole(session.user.role, requiredRole) ? (
    children
  ) : (
    <div className="flex h-full items-center justify-center">
      You do not have permission to access this page.
    </div>
  );
};

export default ProtectedLayout;
