// Force dynamic rendering for all lawyer routes
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function LawyerRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
