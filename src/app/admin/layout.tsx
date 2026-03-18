import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Portal | VisaFlow',
  description: 'Administrative dashboard for managing the VisaFlow platform',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
