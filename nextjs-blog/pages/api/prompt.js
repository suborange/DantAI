// this should handle all the requests, from one front end fetch call

// import puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');
// require("dotenv").config();
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

// GOOGLE API SHIT
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY_GOOGLE);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const sapl_key = process.env.NEXT_PUBLIC_API_KEY_SPELLING;
const sapl_endpoint = 'https://api.sapling.ai/api/v1/edits';

const factual = "factual_query";
const knowledge = "knowledge_query";
const mathematical = "mathematical_query";
const letter_count = "letter_count_query";
const spelling = "spelling_check";
const arithmatic = "arithmetic_query";
const calculus = "calculus_query";

export default async function handler(req, res) {
  // use gemmini
  let prompt_result = "";
  const prompt_head = `Base your respond only using this JSON schema - 
    Prompt: {'promptType': string},
    Return: Prompt; 

    What kind of specific prompt is this: `;
  const prompt_query = req.body.prompt;
  const full_prompt = prompt_head + prompt_query;
  const test = `Using this JSON schema - 
  Prompt: {'promptType': string},
  Return: Prompt;

What kind of specific prompt is this:
Does this sentence have spelling mistakes: 'The phat cat jumped over the larje chare'`;
  console.log(`User prompt:: ${full_prompt}`);

  // parse to get the prompt

  const response = await model.generateContent(full_prompt);     // if this is backend, then this data would be the result(s)

  // parse the text:
  // const regex = /'promptType':\s*'([^']+)'/;
  // const regex = /"promptType":\s*"([^"]+)"/;

  const stringy_response = JSON.stringify(response.response.candidates[0].content.parts[0].text, null, 4)

  // Match the regex and extract the value
  // const match = stringy_response.match(regex);
  const match = stringy_response.includes("pelling");


  // Check if a match was found
  // const prompt_type
  let prompt_type = "";
  if (match) {
    prompt_type = "spelling_check"; // The value of promptType
    // console.log(promptType); // Output: 'spelling_check'
  } else {
    console.log('No promptType found');
  }

  // console.log(`Response Type:: ${prompt_type}`, JSON.stringify(prompt_type, null, 4));
  // const prompt_type = response.promptType; // should get this from the json returning?
  console.log(`Prompt Type:: ${prompt_type}`);

  // can maybe do substring for math, knowledge, fact
  switch (prompt_type) {
    case factual:
      // code for calling ??
      res.status(200).json({ message: "factual prompt in progress..." })
      break;
    case knowledge:
      // code for calling ??
      res.status(200).json({ message: "knowledge prompt in progress..." })
      break;
    case letter_count:
      // code to count the prompt?
      // form of "R" in word

      const charMatch = prompt_query.match(/"(.+?)"/); // get the char in quotes: "q"
      const wordMatch = prompt_query.match(/word (\w+\??)/); // get the word after word: in the word "strawberry"

      const targetLetter = charMatch ? charMatch[1] : null;
      const word = wordMatch ? wordMatch[1] : null;

      if (targetChar === null || targetWord === null) {
        res.status(404).json({ message: "bad prompt.. could not find.. Try again!" })
      }

      const count = word.split(targetLetter).length - 1;
      const count_result = "";
      if (count === 1) {
        count_result = `There is ${count} occurence of "${targetLetter}" in the word ${word}`;
      }
      else //if (count >= 2){
        count_result = `There are ${count} occurences of "${targetLetter}" in the word ${word}`;
      //}

      res.status(200).json({ message: count_result });



    case spelling:

      const parts = prompt_query.split(':');
      const restOfString = parts[1]?.trim();
      console.log(`rest of string : ${restOfString}`); // looks good!
      // code to call spelling api

      // const response = await fetch(sapl_endpoint, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${sapl_key}`, // Include API key in Authorization header
      //   },
      //   body: JSON.stringify({ restOfString }) // Pass the text to check in the request body
      // });

      // if (!response.ok) {
      //   // Handle error (e.g., network issue, bad API key)
      //   // throw new Error('Failed to check spelling');
      //   console.log("error!!!");
      //   res.status(404).json({ message: "bad prompt.. could not find.. Try again!" })
      // }

      const response2 = await axios.post(
        'https://api.sapling.ai/api/v1/edits',
        {
          "key": `${sapl_key}`, // replace with your API key
          "session_id": 'test session',
          restOfString,
        },
      );
      const { status, data } = response2;
      console.log(`STATUS: ${status}`);
      console.log(JSON.stringify(data, null, 4));

      console.log("\n SPELLING!!!");

      const data2 = await response2.json();
      const sentence = data["edits"][0]["sentence"];
      const error_fix = data["edits"][0]["general_error_type"];
      const fix = data["edits"][0]["replacement"];
      const spell_result = `There was an ${error_fix} mistake. Try to replace ${fix} in ${sentence} `;

      // Log the corrected text and other information from the API
      console.log('Original Text:', text);
      console.log('Corrected Text:', data.corrected_text); // Adjust based on API response structure
      console.log('Suggestions:', data.suggestions); // Check suggestions if available



      break;

    // find all math related one
    case mathematical:
    case arithmatic:
    case calculus:
      // code for calling wolfram alpha - use puppeteer... my fav!
      //const url = 'https://www.wolframalpha.com/'; // the website url to try and access, for login
      const url = 'https://thetawise.ai/demo';
      const boturl = 'https://bot.sannysoft.com/'; // test if you look like a bot or not
      const math_prompt_head = "give me the answer for this question in plain text: ";
      const math_prompt_end = "\n";
      const math_prompt_full = math_prompt_head + prompt_query + math_prompt_end;
      // MAIN FUNCTION
      (async () => {

        // SETUP PAGE
        const browser = await puppeteer.launch();
        let page = await browser.newPage();
        await page.goto(url, {
          waitUntil: "networkidle2",
        });

        // find <p>  class t-p
        // await page.type('p.t-p', math_prompt_full);
        await page.waitForSelector('p.t-p'); // Using CSS selector

        // Select the <p> element with the class "t-p"
        const pElement = await page.$('p.t-p');

        if (pElement) {
          // Focus on the <p> element
          await pElement.focus();

          // Type the text into the <p> element
          await page.keyboard.type(math_prompt_full);

          // Optionally, you can press Enter if needed
          // await page.keyboard.press('Enter');
        } else {
          console.log('<p class="t-p"> element not found');
        }
        // add a new line to the input

        // should enter, now wait for this - class=ParseAndRender -- ParseAndRender_general-styles__zAx0s t-p
        await page.waitForSelector('.ParseAndRender_general-styles__zAx0s.t-p');
        const resultElement = await page.$('.ParseAndRender_general-styles__zAx0s.t-p');

        if (resultElement) {
          // Focus on the <p> element
          // await resultElement.toString();
          const text = await page.evaluate(el => el.textContent, resultElement);
          prompt_result = text;
          // TODO can i do this?
          res.status(200).json({ message: prompt_result })
          console.log(`Found an answer HERE!: ${text}`);
        } else {
          console.log('<p class=".ParseAndRender_general-styles__zAx0s.t-p"> element not found');
        }

      });

      browser.close();
      break;
  }





  // then branch with the rsult here into other fetchs

  // get the respones from second chain of call, and return as the response from here
  res.status(200).json({ message: prompt_result })     // take the result and pass it back to home
}