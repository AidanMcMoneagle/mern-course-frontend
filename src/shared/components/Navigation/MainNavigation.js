import React, { useState } from "react";
import { Link } from "react-router-dom";

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";

import "./MainNavigation.css";

const MainNavigation = (props) => {
  const [sideDrawerisOpen, setSideDrawerisOpen] = useState(false);
  const openDrawerHandler = () => {
    setSideDrawerisOpen(true);
  };

  const closeDrawerHandler = () => {
    setSideDrawerisOpen(false);
  };

  return (
    <React.Fragment>
      {sideDrawerisOpen && <Backdrop onClick={closeDrawerHandler} />}
      {sideDrawerisOpen}
      <SideDrawer show={sideDrawerisOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>

      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={openDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">Your Places</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
