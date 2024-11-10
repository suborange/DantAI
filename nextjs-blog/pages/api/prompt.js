// this should handle all the requests, from one front end fetch call
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });




export default async function handler(req, res) {
    // use gemmini
    const prompt_query = req.body.prompt;
    const prompt_type = "what kind of prompt is this: ";
    const full_prompt = prompt_query + prompt_type;
    console.log(`User prompt ${prompt_query}`);
    const result = await model.generateContent(full_prompt);     // if this is backend, then this data would be the result(s)
    console.log(result.response.text());

    
    // take the result and pass it back to home
    setResponse(result); 
        
    

    // then branch with the rsult here into other fetchs

    // get the respones from second chain of call, and return as the response from here
    res.status(200).json({ message: 'Hello from Next.js!' })
  }