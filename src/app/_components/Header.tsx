
'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import nav from '@/app/_data/nav'
import type { NavItem } from '@/app/_data/nav'
import styles from '@/styles/header.module.scss'

import { useSupabaseSession } from '../_hooks/useSupabaseSession'
import { supabase } from '../_libs/supabase'

const Header: React.FC = () => {
  const router = useRouter()

  // ログイン状態を取得
  const { session, isLoading } = useSupabaseSession()

  // ログアウト処理
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      alert('ログアウトに失敗しました')
      return
    }

    router.replace('/')
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.navList__item}>
            <Link className={styles.navList__link} href="/">
              Blog
            </Link>
          </li>
        </ul>

        {!isLoading && (
          <ul className={styles.navList}>
            {session ? (
              <>
                <li className={styles.navList__item}>
                  <Link className={styles.navList__link} href="/admin/posts">
                    管理画面
                  </Link>
                </li>
                <li className={styles.navList__item}>
                  <button className={styles.navList__link} onClick={handleLogout}>
                    ログアウト
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className={styles.navList__item}>
                  <Link className={styles.navList__link} href="/contact">
                    お問い合わせ
                  </Link>
                </li>
                <li className={styles.navList__item}>
                  <Link className={styles.navList__link} href="/sign_in">
                    ログイン
                  </Link>
                </li>
              </>
            )}
          </ul>
        )}
      </nav>
    </header>
  )
}

export default Header
