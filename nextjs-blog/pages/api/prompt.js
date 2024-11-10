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
            const url = 'https://www.wolframalpha.com/'; // the website url to try and access, for login
            const boturl = 'https://bot.sannysoft.com/'; // test if you look like a bot or not
            
            // MAIN FUNCTION
            (async () => {
            
                // SETUP PAGE
                const browser = await puppeteer.launch();
                let page = await browser.newPage();
                await page.goto(url, {
                    waitUntil: "networkidle2",
                });


            break;
    }




    // then branch with the rsult here into other fetchs

    // get the respones from second chain of call, and return as the response from here
    res.status(200).json({ message: 'Hello from Next.js!' })     // take the result and pass it back to home
}