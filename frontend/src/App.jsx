
import viteLogo from '/vite.svg'
import './App.css'
import {useState, useEffect} from "react"
import axios from "axios"

function App() {
  const [data, setData] = useState()

  useEffect (() => {
    async function grabData() {
      const response = await axios.get
      ("http://localhost:3500/events/66a73536e4715515aba3da33")
      if (response.status === 200) {
        setData(response.data)
      }

    }
    grabData()

  }, [])

  return (
    <>
      {JSON.stringify(data)}

    </>
  )
}

export default App
