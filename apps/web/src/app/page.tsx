import type { HealthResponse } from 'shared-types';

const sampleHealth: HealthResponse = {
  status: 'ok',
  service: 'stack-track-api',
  checked_at: '1970-01-01T00:00:00.000Z',
  uptime_seconds: 0,
  checks: {
    process: 'up',
  },
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Stack <span className="text-[hsl(280,100%,70%)]">Trace</span>
        </h1>
        <p className="max-w-xl text-center text-lg text-white/80">
          Next.js frontend talking to the NestJS API. Shared contracts live in{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">
            shared-types
          </code>
          .
        </p>
        <section className="w-full max-w-xl rounded-xl bg-white/10 p-6">
          <h2 className="text-xl font-semibold">Sample health payload</h2>
          <p className="mt-2 text-sm text-white/70">
            Typed as <code>HealthResponse</code> from the workspace package.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-black/40 p-4 text-left text-sm text-emerald-200">
            {JSON.stringify(sampleHealth, null, 2)}
          </pre>
        </section>
      </div>
    </main>
  );
}
