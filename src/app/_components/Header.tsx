"use client";
import React from "react";
import Link from "next/link";
import nav from "@/app/_data/nav";
import type { NavItem } from "@/app/_data/nav";
import styles from '@/styles/header.module.scss'

const Header: React.FC = () => (
  <header className={styles.header}>
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        { nav.map((elem: NavItem) => {
          return (
            <li className={styles.navList__item} key={elem.id}>
              <Link className={styles.navList__link} href={`${elem.href}`}>{elem.name}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  </header>
);


export default Header;