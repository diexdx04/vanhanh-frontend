import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  console.log("day la authlayout ");

  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default AuthLayout;
