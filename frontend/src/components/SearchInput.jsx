import Creatable from 'react-select/creatable';

const SearchInput = ({query, requestKeywordData, requestFreshKeywordData, loading, setQuery, keywords, setExistingKeyword}) => {

  return (
    <section className="search py-3">
        <div className="container">
          <div className="card">
            <div className="card-body">
              <div className="card-title h4">
                Search Grant Data
              </div>
              {/* <ul className="d-flex list-unstyled tags-wrapper">
                {
                  keywords.map(k => (
                    <li key={k.id} className='tag'>
                      <div className="">
                        <input type="checkbox" onChange={setExistingKeyword} name="keywords[]" id={k.id} value={k.keyword} />
                        <label htmlFor={k.id}>
                          <span>{k.keyword}</span>
                        </label>
                      </div>
                    </li>
                  ))
                }
              </ul> */}
              {/* <div className="form-group">
                <input type='text' placeholder='Enter a new keyword' value={query} onChange={e => setQuery(e.target.value)} className='form-control w-100' />
              </div> */}
              <Creatable
                value={query}
                onChange={setQuery}
                options={keywords.map(k => ({"label": k.keyword, 'value': k.keyword}))}
                isClearable={false}
                isMulti={true}
                createOptionPosition={'last'}
                isLoading={loading}
              />
              <div className="d-flex align-items-center gap-2">
                <div className="form-group mt-2">
                  <button onClick={requestKeywordData} disabled={loading} className="btn btn-outline-primary">Search { loading ? <span className='ms-2 spinner-border spinner-border-sm text-primary'></span> : null }</button>
                </div>
                <div className="form-group mt-2">
                  <button onClick={requestFreshKeywordData} disabled={loading} className="btn btn-outline-primary">Search Fresh Data { loading ? <span className='ms-2 spinner-border spinner-border-sm text-primary'></span> : null }</button>
                </div>
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