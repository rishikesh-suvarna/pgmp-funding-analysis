import React, { useEffect, useState } from 'react'
import ApiService from '../services/ApiService'

const SearchInput = ({query, requestKeywordData, loading, setQuery, keywords, setExistingKeyword}) => {

  return (
    <section className="search py-3">
        <div className="container">
          <div className="card">
            <div className="card-body">
              <div className="card-title h4">
                Search Grant Data
              </div>
              <ul className="d-flex list-unstyled tags-wrapper">
                {
                  keywords.map(k => (
                    <li key={k.id} className='tag'>
                      <div className="">
                        <input type="radio" onChange={setExistingKeyword} name="keywords[]" id={k.id} value={k.keyword} />
                        <label htmlFor={k.id}>
                          <span>{k.keyword}</span>
                        </label>
                      </div>
                    </li>
                  ))
                }
              </ul>
                <div className="form-group">
                  <input type='text' placeholder='Enter a new keyword' value={query} onChange={e => setQuery(e.target.value)} className='form-control w-100' />
                </div>
              <div className="form-group mt-2">
                <button onClick={requestKeywordData} disabled={loading} className="btn btn-outline-primary">Search { loading ? <span className='ms-2 spinner-border spinner-border-sm text-primary'></span> : null }</button>
              </div>
              {/* <div className="form-group mt-2">
                <button onClick={fetchKeywordData} disabled={loading} className="btn btn-outline-primary">Fetch { loading ? <span className='ms-2 spinner-border spinner-border-sm text-primary'></span> : null }</button>
              </div> */}
            </div>
          </div>
        </div>
      </section>
  )
}

export default SearchInput