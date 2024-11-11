export type NavItem = {id: number, name: string, href: string};

export const nav: NavItem[] = [
  { id: 1, name: 'Blog', href: '/' },
  { id: 2, name: 'お問い合わせ', href: '/contact/' },
]

export default nav;