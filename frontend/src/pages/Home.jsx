import React, { useState } from 'react'
import ApiService from '../services/ApiService'

const Home = () => {
  const [query, setQuery] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchKeywordData = async () => {
    try {
      setLoading(true)
      let res = await ApiService.fetchKeywordData(query)
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
                <button onClick={fetchKeywordData} disabled={loading} className="btn btn-outline-primary">Search { loading ? <span className='ms-2 spinner-border spinner-border-sm text-primary'></span> : null }</button>
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
                    <div className="col-lg-4 mb-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="card-title h6">{d.title}</div>
                          <p>{d.teaser}</p>
                          <p><b>Total Funding</b>: {d.totalFunding}</p>
                          <p><b>Start Date</b>: {d.startDate}</p>
                          <p><b>End Date</b>: {d.endDate}</p>
                          <p><b>Duration</b>: {d.duration}</p>
                          <p><span class="badge bg-primary">{d.status}</span></p>
                        </div>
                        <div className="card-footer">
                          <div className="d-flex align-items-center justify-content-between">
                            <button className="btn btn-outline-success w-100 me-2">Approve</button>
                            <button className="btn btn-outline-danger w-100">Reject</button>
                          </div>
                        </div>
                      </div>
                    </div>
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