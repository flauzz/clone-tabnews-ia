import ConfettiAnimation from './Confetti';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getTotalContents() {
  try {
    const response = await fetch(
      'https://www.tabnews.com.br/api/v1/contents?strategy=new&page=1&per_page=1',
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.error(`Falha ao consultar API do TabNews: status ${response.status}`);
      return null;
    }

    const totalHeader = response.headers.get('x-pagination-total-rows');
    if (totalHeader) {
      return Number(totalHeader);
    }

    const linkHeader = response.headers.get('link');
    if (linkHeader) {
      const match = linkHeader.match(/page=(\d+)&per_page=\d+>; rel="last"/);
      if (match && match[1]) {
        return Number(match[1]);
      }
    }

    return null;
  } catch (error) {
    console.error('Erro na requisição para API do TabNews:', error);
    return null;
  }
}

export default async function Home() {
  const totalContents = await getTotalContents();

  return (
    <main className="page-wrapper">
      <ConfettiAnimation />
      <div className="card">
        <div className="badge-wrapper">
          <div className="badge">
            <span className="pulse-dot"></span>
            Em Construção
          </div>
        </div>

        <h1 className="title">Clone TabNews</h1>

        <p className="phrase">
          Estamos nesse exato momento reconstruindo o TabNews, um lugar na internet para quem trabalha com tecnologia e precisa consumir conteúdos com valor concreto.
        </p>

        <div className="stats-card">
          <span className="stats-label">Total de conteúdos publicados no TabNews</span>
          <span className="stats-value">
            {totalContents !== null ? totalContents.toLocaleString('pt-BR') : 'Indisponível no momento'}
          </span>
          <span className="stats-note">Atualizado via API pública a cada acesso</span>
        </div>

        <div className="button-wrapper">
          <a
            href="https://www.tabnews.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="official-link"
          >
            Acessar o TabNews oficial
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </main>
  );
}
