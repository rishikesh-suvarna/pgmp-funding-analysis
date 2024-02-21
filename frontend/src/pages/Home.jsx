import React, { useState } from 'react'
import ApiService from '../services/ApiService'
import GrantCard from '../components/GrantCard'

const Home = () => {
  const [query, setQuery] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const requestKeywordData = async () => {
    try {
      setLoading(true)
      let res = await ApiService.requestKeywordData(query)
      console.log(res)
      fetchKeywordData()
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const fetchKeywordData = async () => {
    try {
      setLoading(true)
      let res = await ApiService.fetchKeywordData(query)
      console.log(res)
      setData(res)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <main>
      <section className="search py-3">
        <div className="container">
          <div className="card">
            <div className="card-body">
              <div className="card-title">
                Search Grant Data
              </div>
                <div className="form-group">
                  <input type='text' placeholder='Enter keyword' value={query} onChange={e => setQuery(e.target.value)} className='form-control w-100' />
                </div>
              <div className="form-group mt-2">
                <button onClick={requestKeywordData} disabled={loading} className="btn btn-outline-primary">Search { loading ? <span className='ms-2 spinner-border spinner-border-sm text-primary'></span> : null }</button>
              </div>
              <div className="form-group mt-2">
                <button onClick={fetchKeywordData} disabled={loading} className="btn btn-outline-primary">Fetch { loading ? <span className='ms-2 spinner-border spinner-border-sm text-primary'></span> : null }</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {
        data.length 
        ?
          <section className="response py-3">
            <div className="container">
              <div className="h4">Data</div>
              <div className="row">
                {
                  data.map(d => (
                    <GrantCard d={d} />
                  ))
                }
              </div>
            </div>
          </section>
        :
        null
      }
    </main>
  )
}

export default Home