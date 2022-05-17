import { useState, useEffect } from 'react';
import './App.scss';
import { OpenAIApi, Configuration } from 'openai';

function App() {

const [data, setdata] = useState([])
const [isLoading, setisLoading] = useState(false)

const handleSubmit = async(e) => {
  e.preventDefault()
  const formdeets = new FormData(e.target),
  formdeetsobj = Object.fromEntries(formdeets.entries())
  // API
  const configuration = new Configuration({
    apiKey: `${process.env.REACT_APP_BASE_KEY}`,
  });
  const openai = new OpenAIApi(configuration);
  setisLoading(true)
  await openai.createCompletion("text-curie-001", {
    prompt: `${formdeetsobj.prompt}`,
    temperature: 0.8,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  }).then((response) => {  
    setdata([{
      prompt: `${formdeetsobj.prompt}`,
      response: `${response.data.choices[0].text}`,
      id: data.length     
  }, ...data])
  });setisLoading(false);
}
//storing responses locally
useEffect(() => {
  const data = localStorage.getItem("data");
  if (data) {
    setdata(JSON.parse(data));
  }
}, []);

  return (
    <div id='App' className='container'>
      <div className='d-flex flex-row'>        
        <nav className='mt-3 me-auto py-1 px-2'>OPEN AI</nav>
      </div>
      <div className='d-flex flex-column col-12 mx-auto col-md-8 my-4'>
        <header className='fs-2 mb-2'>Let's have fun with an AI</header>
        <p className=''>OpenAI’s API provides access to GPT-3, which performs a wide variety of natural language tasks, and Codex, which translates natural language to code.</p>
        {isLoading ? <p className='text-center fs-2'>Loading...</p>:
        <form action='' onSubmit={handleSubmit} className='d-flex flex-column'>
        <label className='mb-2 fs-6'>Enter prompt</label>
        <textarea name='prompt' cols='30' rows='10'></textarea>
        <button className='ms-auto mt-3 py-1 px-3' type='submit'>Submit</button>
      </form> 
      }
        
        {/* Responses */}        
         {data && data.map((data) => {
           return (
            <div className='p-2 card mt-3' key={data.id}>
              <div className="flex-row d-flex mb-3">
                <h4 className='col-3'>Prompt:</h4>
                <p className='col-9'>{data.prompt}</p>
              </div>
            <div className="flex-row d-flex">
              <h4 className='col-3'>Response:</h4>
              <p className='col-9'>{data.response}</p>
            </div>
          </div>
          )})} 
      </div>
    </div>
  );
}

export default App;
