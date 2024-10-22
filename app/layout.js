import "./globals.css";

export const metadata = {
  title: "Store Receipt",
  description: "A receipt styled page using Next.js and Tailwind CSS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className="bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto p-6">
          {children}
        </div>
      </body>
    </html>
  );
}
