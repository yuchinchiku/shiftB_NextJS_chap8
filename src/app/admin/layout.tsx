'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouteGuard } from './_hooks/useRouteGuard'
import styles from '@/styles/blogList.module.scss'


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useRouteGuard()

  const pathname = usePathname()
  const isSelected = (href: string) => {
    return pathname.includes(href)
  }

  return(
    <>
      <div className={styles.aside__wrapper}>
        <aside className={styles.aside}>
          <Link className={styles.aside__link} href="/admin/posts/">記事一覧</Link>
          <Link className={styles.aside__link} href="/admin/categories/">カテゴリー一覧</Link>
        </aside>
        <div className={styles.listContent}>{children}</div>
      </div>
    </>
  );
}
