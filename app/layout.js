import './globals.css';

export const metadata = {
  title: 'Eu Te Amo',
  description: 'Clone TabNews',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
