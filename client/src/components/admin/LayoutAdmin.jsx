import React, { useEffect, useState } from 'react'
import '../../assets/css/styles.css'
import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Nav from './nav'

function LayoutAdmin() {
    return (
        <>
            <Nav />
            <div id="layoutSidenav">
                <div id="layoutSidenav_nav">
                    <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                        <div className="sb-sidenav-menu">
                            <div className="nav">
                                <div className="sb-sidenav-menu-heading">Core</div>
                                <Link className='nav-link' to={'/admin/'}>
                                    <div className="sb-nav-link-icon">
                                        <i className="fas fa-tachometer-alt" />
                                    </div>
                                    Dashboard
                                </Link>
                                <div className="sb-sidenav-menu-heading">Interface</div>
                                <a
                                    className="nav-link collapsed"
                                    href="#"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseLayouts"
                                    aria-expanded="false"
                                    aria-controls="collapseLayouts"
                                >
                                    <div className="sb-nav-link-icon">
                                        <i className="fas fa-columns" />
                                    </div>
                                    Card
                                    <div className="sb-sidenav-collapse-arrow">
                                        <i className="fas fa-angle-down" />
                                    </div>
                                </a>
                                <div
                                    className="collapse"
                                    id="collapseLayouts"
                                    aria-labelledby="headingOne"
                                    data-bs-parent="#sidenavAccordion"
                                >
                                    <nav className="sb-sidenav-menu-nested nav">
                                        <Link className='nav-link' to={'/admin/back-card'}>Back Card</Link>
                                        <Link className='nav-link' to={'/admin/front-card'}>Front Card</Link>
                                    </nav>
                                </div>
                                <a
                                    className="nav-link collapsed"
                                    href="#"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapsePages"
                                    aria-expanded="false"
                                    aria-controls="collapsePages"
                                >
                                    <div className="sb-nav-link-icon">
                                        <i className="fas fa-book-open" />
                                    </div>
                                    Account
                                    <div className="sb-sidenav-collapse-arrow">
                                        <i className="fas fa-angle-down" />
                                    </div>
                                </a>
                                <div
                                    className="collapse"
                                    id="collapsePages"
                                    aria-labelledby="headingTwo"
                                    data-bs-parent="#sidenavAccordion"
                                >
                                    <nav className="sb-sidenav-menu-nested nav accordion"
                                        id="sidenavAccordionPages">
                                        <Link className='nav-link' to={'/admin/users'}>User</Link>
                                    </nav>
                                </div>
                                <a
                                    className="nav-link collapsed"
                                    href="#"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseLayoutsrRooms"
                                    aria-expanded="false"
                                    aria-controls="collapseLayoutsrRooms"
                                >
                                    <div className="sb-nav-link-icon">
                                        <i className="fas fa-columns" />
                                    </div>
                                    Rooms
                                    <div className="sb-sidenav-collapse-arrow">
                                        <i className="fas fa-angle-down" />
                                    </div>
                                </a>
                                <div
                                    className="collapseroom"
                                    id="collapseLayoutsrRooms"
                                    aria-labelledby="headingOne"
                                    data-bs-parent="#sidenavAccordion"
                                >
                                    <nav className="sb-sidenav-menu-nested nav">
                                        <Link className='nav-link' to={'/admin/rooms'}>Rooms</Link>
                                        <Link className='nav-link' to={'/admin/room-cate'}>Room category</Link>
                                    </nav>
                                </div>
                                <div className="sb-sidenav-menu-heading">Addons</div>
                                <a className="nav-link" href="charts.html">
                                    <div className="sb-nav-link-icon">
                                        <i className="fas fa-chart-area" />
                                    </div>
                                    Charts
                                </a>
                                <a className="nav-link" href="tables.html">
                                    <div className="sb-nav-link-icon">
                                        <i className="fas fa-table" />
                                    </div>
                                    Tables
                                </a>
                            </div>
                        </div>
                        <div className="sb-sidenav-footer">
                            <div className="small">Logged in as:</div>
                            Start Bootstrap
                        </div>
                    </nav>
                </div>
                <div id="layoutSidenav_content">
                    <Outlet />
                </div>
            </div>

        </>
    )
}

export default LayoutAdmin