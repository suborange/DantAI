import { Component, useState } from 'react';
import styles from '../styles/Prompt.module.css';

export default function Prompt() {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");

    const handleSubmit = async (e) => {
        // console.log('f');
        e.preventDefault();
 // only call the backend one time! instead of chaining network calls back and forth
        try {
          const res = await fetch("/api/prompt", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: input }),
          });

          const result = await res.json();// if this is backend, then this data would be the result(s)
          console.log(`full cycle result:: ${result}`)
          // take the result and pass it back to home
          setResponse(result.message); // get the message returned
        //   setResponse(data.choices[0]?.message?.content || "No response from API");
          
        } catch (error) {
          console.error("Error:", error);
          setResponse("Error fetching response from API");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}> {/** .then() chain here? render the results page with the results?  */}
                <textarea class={styles.input} value={input} onChange={(e) => setInput(e.target.value)} placeholder='Please enter your prompt...'>
                </textarea>

            </form>
            <button class={styles.prompt} type='submit'> &gt;Prompt&lt;
            </button>


        </div>
    );
}



