import './globals.css';

export const metadata = {
  title: 'TabNews - Em Construção',
  description: 'Estamos nesse exato momento reconstruindo o TabNews.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
