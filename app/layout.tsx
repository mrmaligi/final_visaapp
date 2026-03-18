import "./globals.css"
import Navbar from "@/components/Navbar"

export const metadata = {
  title: "Visa Application Platform",
  description: "Secure and easy visa application platform.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col items-center w-full">
          {children}
        </main>
        <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>{" "}
            and Next.js
          </p>
        </footer>
      </body>
    </html>
  )
}
