import { Suspense } from 'react';
import ConfettiAnimation from './Confetti';

export const dynamic = 'force-dynamic';

const TABNEWS_API_TIMEOUT_MS = 3000;
const CACHE_TTL_MS = 60 * 1000;
const RETRY_AFTER_FAILURE_MS = 30 * 1000;

// Cache em memória do servidor: evita chamar a API a cada acesso (e tomar 429)
// e mantém o último total válido quando a API falha.
const totalContentsCache = {
  value: null,
  nextFetchAt: 0,
  pending: null,
};

async function getTotalContents() {
  const cache = totalContentsCache;

  if (Date.now() < cache.nextFetchAt) {
    return cache.value;
  }

  // Acessos simultâneos compartilham a mesma requisição à API.
  cache.pending ??= fetchTotalContents()
    .then((total) => {
      if (total !== null) {
        cache.value = total;
        cache.nextFetchAt = Date.now() + CACHE_TTL_MS;
      } else {
        cache.nextFetchAt = Date.now() + RETRY_AFTER_FAILURE_MS;
      }

      return cache.value;
    })
    .finally(() => {
      cache.pending = null;
    });

  return cache.pending;
}

async function fetchTotalContents() {
  try {
    const response = await fetch(
      'https://www.tabnews.com.br/api/v1/contents?strategy=new&page=1&per_page=1',
      {
        cache: 'no-store',
        signal: AbortSignal.timeout(TABNEWS_API_TIMEOUT_MS),
      }
    );

    if (!response.ok) {
      console.error(`Falha ao consultar API do TabNews: status ${response.status}`);
      return null;
    }

    // Só os headers interessam: descarta o corpo para liberar a conexão.
    response.body?.cancel();

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

async function TotalContents() {
  const totalContents = await getTotalContents();

  return totalContents !== null ? totalContents.toLocaleString('pt-BR') : 'Indisponível no momento';
}

export default function Home() {
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
          <span className="stats-value" aria-live="polite">
            <Suspense fallback={<span className="stats-loading">Carregando…</span>}>
              <TotalContents />
            </Suspense>
          </span>
          <span className="stats-note">Atualizado via API pública a cada minuto</span>
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
