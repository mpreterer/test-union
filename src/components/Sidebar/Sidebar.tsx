import { FC, useEffect, useState } from "react";
import classnames from "classnames";

import logo from "../../assets/images/logo.svg";
import exit from "./images/exit.svg";

import { sidebarList } from "./contants";
import { Link } from "react-router-dom";
import { SCREENS } from "../../routes/endpoints";
import { WindowSizes } from "../../shared/constants/WindowSizes";
import "./Sidebar.scss";

type Props = {
  avatar: string;
  name: string;
  post: string;
};

const Sidebar: FC<Props> = ({ avatar, name, post }) => {
  const [mobileVersion, setMobileVersion] = useState(false);
  const [burgerOpen, setBurgerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setMobileVersion(window.innerWidth <= WindowSizes.large);
      console.log(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClickBurger = () => {
    setBurgerOpen(!burgerOpen);
  };

  return (
    <div
      className={classnames("sidebar", {
        sidebar_mobile: mobileVersion,
        sidebar_mobile_open: burgerOpen,
      })}
    >
      {mobileVersion ? (
        <div
          className={classnames("sidebar__burger", {
            sidebar__burger_active: burgerOpen,
          })}
          onClick={handleClickBurger}
        >
          <span className="sidebar__burger-line"></span>
        </div>
      ) : (
        ""
      )}
      <div
        className={classnames("sidebar__container", {
          sidebar__container_mobile: mobileVersion,
          sidebar__container_mobile_open: burgerOpen,
        })}
      >
        {!mobileVersion ? (
          <Link to={SCREENS.LANDING}>
            <img className="sidebar__logo" src={logo} alt="лого" />
          </Link>
        ) : (
          ""
        )}
        <div className="sidebar__admin-info-container">
          <img className="sidebar__avatar" src={avatar} alt="аватар" />
          <div
            className={classnames("sidebar__admin-info", {
              "sidebar__admin-info_open": mobileVersion,
            })}
          >
            <span className="sidebar__name">{name}</span>
            <span className="sidebar__post">{post}</span>
          </div>
        </div>
        <ul className="sidebar__list">
          {sidebarList.map(
            (item: { img: string; title: string; to: string }) => (
              <li className="sidebar__item" key={item.title}>
                <Link to={item.to} className="sidebar__link">
                  <img
                    className="sidebar__item-img"
                    src={item.img}
                    alt={item.title}
                  />
                  <span
                    className={classnames("sidebar__item-title", {
                      "sidebar__item-title_open": mobileVersion,
                    })}
                  >
                    {item.title}
                  </span>
                </Link>
              </li>
            )
          )}
        </ul>
        <Link className="sidebar__exit" to={"/change-me/mock"}>
          <img
            className={classnames("sidebar__exit-img", {
              "sidebar__exit-img_red": mobileVersion,
            })}
            src={exit}
            alt="выйти"
          />
          <span
            className={classnames("sidebar__exit-title", {
              "sidebar__exit-title_open": mobileVersion,
            })}
          >
            Выйти
          </span>
        </Link>
      </div>
    </div>
  );
};

export { Sidebar };
