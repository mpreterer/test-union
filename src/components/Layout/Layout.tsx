import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar";

import avatar from "../../assets/images/default-avatar.svg";

import "./Layout.scss";

const Layout: FC = () => {
  return (
    <div className="layout">
      <div className="layout__sidebar">
        <Sidebar avatar={avatar} name="Артем Иванов" post="Собственник" />
      </div>
      <div className="layout__main">
        <Outlet />
      </div>
      <div className="layout__footer"></div>
    </div>
  );
};

export { Layout };
