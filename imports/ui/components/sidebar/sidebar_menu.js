import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const SideBarMenu = () => (
  <ul className="sidebar-menu" data-widget="tree">
    <li className="header">MAIN NAVIGATION</li>

    {/* <li className="active treeview">
      <a href="#">
        <i className="fa fa-dashboard" /><span>Expenses</span>
        <span className="pull-right-container">
          <i className="fa fa-angle-left pull-right" />
        </span>
      </a>
      <ul className="treeview-menu">
        <li>
          <Link to="/dashboard"><i className="fa fa-circle-o" />New Expense</Link>
        </li>
        <li>
          <Link to="dashboard/overview"><i className="fa fa-circle-o" />Overview</Link>
        </li>
      </ul>
    </li> */}
    <li>
      <Link to="/dashboard">
        <i className="fa fa-users" /> <span> Dashboard </span>
      </Link>
    </li>
    <li>
      <Link to="/expense">
        <i className="fa fa-users" /> <span> Expense </span>
      </Link>
    </li>
    {/* <li>
      <Link to="/dashboard">
        <i className="fa fa-users" /> <span> Dashboard </span>
        <small className="label pull-right bg-blue" > {userCount} </small>
      </Link>
    </li> */}
  </ul>
);

SideBarMenu.propTypes = {
  userCount: PropTypes.number,
};

export default SideBarMenu;
