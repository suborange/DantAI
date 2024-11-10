import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Component, useState } from 'react';
import Prompt from '../components/prompt'; // just go back to main folder!

export default function Home() {
  
  const [result, setResult] = useState("");
  
  return (
    <div className={styles.container}>
      <Head>
        <title>DantAI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className={[styles.home_input, styles.container]} > {/**fix this alignment shit */}
          <Prompt/>
{/* now after this shit runs, pass the reseults as a prop/child to the prompt component */}
        </div>
      </main>

      <footer>

      </footer>


    </div>
  );
}
