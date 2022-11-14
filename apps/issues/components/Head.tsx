import Head from 'next/head';

function HeadComponent({ title }: { title: string }) {
  return (
    <Head>
      <title>Issues - {title}</title>
    </Head>
  );
}

export default HeadComponent;
