"use client";
import React from "react";
import Link from "next/link";
import nav from "../_data/nav";
import type { NavItem } from "../_data/nav";

const Header: React.FC = () => (
  <header className='header'>
    <nav className='nav'>
      <ul className='navList'>
        { nav.map((elem: NavItem) => {
          return (
            <li className='navList__item' key={elem.id}>
              <Link className='navList__link' href={`${elem.href}`}>{elem.name}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  </header>
);


export default Header;