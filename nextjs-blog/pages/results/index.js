/**this should be the rendered page for the results from the porcessing */

import Head from 'next/head';
import styles from '../../styles/Results.module.css';
import Link from 'next/link';
import ResultCard from '../../components/result_card'; // because it is in another folder!
export default function Results() {

  return (
    <div className={styles.container}>
      <Head>
        <title>DantAI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <ResultCard/> {/** put the api calls and returns here? pass it as a prop/child? */}
        
      </main>

      <footer>
        
      </footer>

      
    </div>
  );
}
