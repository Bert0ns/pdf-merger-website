import ClientLayout from './client-layout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout htmlAttrs={{"lang":"en"}} >{children}</ClientLayout>;
}