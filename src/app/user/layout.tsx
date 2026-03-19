// Force dynamic rendering for all user routes
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function UserRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
