// this should handle all the requests, from one front end fetch call

// import puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');
// require("dotenv").config();
import dotenv from 'dotenv';
// GOOGLE API SHIT
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const factual = "factual_query";
const knowledge = "knowledge_query";
const mathematical = "mathematical_query";

export default async function handler(req, res) {
    // use gemmini
    let prompt_result = "";
    const prompt_head = `Using this JSON schema - 
    Prompt: {'promptType': string},
    Return: Prompt; 

    what kind of prompt is this: `;
    const prompt_query = req.body.prompt;
    const full_prompt = prompt_head + prompt_query;

    console.log(`User prompt ${full_prompt}`);

    const response = await model.generateContent(full_prompt);     // if this is backend, then this data would be the result(s)
    const prompt_type = response.promptType; // should get this from the json returning?
    console.log(`Prompt Type: ${prompt_type}`);

    // can maybe do substring for math, knowledge, fact
    switch (prompt_type) {
        case factual:
            // code for calling ??
            break;
        case knowledge:
            // code for calling ??
            break;
        case mathematical:
            // code for calling wolfram alpha - use puppeteer... my fav!
            //const url = 'https://www.wolframalpha.com/'; // the website url to try and access, for login
            const url = 'https://thetawise.ai/demo';
            const boturl = 'https://bot.sannysoft.com/'; // test if you look like a bot or not
            const math_prompt_head = "give me the answer for this question in plain text: ";
            const math_prompt_end ="\n";
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
                console.log('<p class="t-p"> element not found');
              }

            });

            browser.close();
            break;
    }





    // then branch with the rsult here into other fetchs

    // get the respones from second chain of call, and return as the response from here
    res.status(200).json({ message: prompt_result })     // take the result and pass it back to home
}