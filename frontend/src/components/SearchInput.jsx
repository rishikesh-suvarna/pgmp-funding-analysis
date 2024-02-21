import React from 'react'

const SearchInput = ({query, requestKeywordData, loading, setQuery}) => {
  return (
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