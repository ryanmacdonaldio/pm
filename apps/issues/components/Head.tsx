import Head from 'next/head';

function HeadComponent({ title }: { title: string }) {
  const message = `Issues - ${title}`;

  return (
    <Head>
      <title>{message}</title>
    </Head>
  );
}

export default HeadComponent;
