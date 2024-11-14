import "./globals.css";

export const metadata = {
  title: "BobaBoba Order Receipt",
  description: "Make a request for your BobaBoba order!",
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
