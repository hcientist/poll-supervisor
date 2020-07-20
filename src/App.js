import React, { useState, useEffect } from 'react'
import './App.css'

const GET_URL = '/api/poll/questions'
const POST_URL = '/api/poll'

function App () {
  const handler = value => () => {
    setCorrect(value)
  }

  const submitter = async evt => {
    evt.preventDefault()
    evt.stopPropagation()
    const data = new FormData(document.querySelector('form'))
    try {
      const response = await fetch(POST_URL, {
        method: 'POST',
        body: data
      })
      return response.json()
    } catch (err) {
      console.error('error posting rating', err)
    }
  }

  const [id, setId] = useState('')
  const [quote, setQuote] = useState(null)
  const [summary, setSummary] = useState(null)
  const [correct, setCorrect] = useState('')

  useEffect(() => {
    async function fetchQuestions() {
      const response = await fetch(GET_URL)
      return response.json()
    }
    fetchQuestions()
      .then(data => {
        console.log(data)
        const questions = data.questions
        setId(questions[0].id)
        setQuote(questions[0].quote)
        setSummary(questions[0].summary)
      })
      .catch(err => {
        console.error('error in fetching questions', err)
        console.log('defaulting')
        const data = {
          questions: [
            {
              id: 42,
              quote: 'MAGA',
              summary: 'fearful'
            }
          ]
        }
        const questions = data.questions
        setId(questions[0].id)
        setQuote(questions[0].quote)
        setSummary(questions[0].summary)
      })
  }, [])

  return (
    <main className='correct-summary'>
      <h1>Can we say that</h1>
      <blockquote>{ quote }</blockquote>
      <h1>means</h1>
      <summary>{ summary }</summary>
      <h1>?</h1>
      <form onSubmit={submitter}>
        <input type='hidden' name='summary-id' value={id} />
        <Answer value='Yes' correct={correct} setCorrect={setCorrect} handle={handler('Yes')}>
          Yes <i className='far fa-thumbs-up' />
        </Answer>
        <Answer value='No' correct={correct} setCorrect={setCorrect} handle={handler('No')}>
          No <i className='far fa-thumbs-down' />
        </Answer>
      </form>
      {/* <p>Correct? {correct}</p> */}

    </main>
  )
}

function Answer (props) {
  return (
    <div className='form-control'>
      <input type='radio' name='correct' id={`correct-${props.value}`} value={props.value} checked={props.correct === props.value} onChange={props.handle} />
      <label htmlFor='correct-yes'>{props.value}</label>
      <button type='submit' value={props.value} onClick={props.handle}>{props.children}</button>
    </div>
  )
}

export default App
