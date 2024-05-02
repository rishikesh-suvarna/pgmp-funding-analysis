import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import ApiService from '../services/ApiService'
import moment from 'moment'
import InfiniteScroll from 'react-infinite-scroll-component'


const SearchHistory = () => {

  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchAllSearchHistory = async (page) => {
    try {
      let res = await ApiService.fetchAllSearchHistory(page);
      setHistory(history => ([...history, ...res.history]));
      setTotal(res.total)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllSearchHistory(page);
    return  () => {
      setHistory([])
      setPage(1)
      setTotal(0)
    }
  }, [page]);

  return (
    <main>
        <Navbar />
        <section className="py-5">
          <div className="container">
          <InfiniteScroll
          dataLength={history.length}
          next={() => setPage((page) => parseInt(page) + 1)}
          hasMore={history.length && total > page ? true : false}
          scrollThreshold={"1px"}
        >
          <ul className="list-unstyled mb-0">
            {
              history.map(h => (
                <li>
                  <div className="card mb-2">
                    <div className="card-body">
                      {/* <p>ID: {h.id}</p> */}
                      <p>Keyword: {h.keyword}</p>
                      <p>API Agency: {h.source}</p>
                      <p>Status: {h.is_completed ? <span className="badge bg-success">Completed</span> : <span className="badge bg-secondary">Incomplete</span>}</p>
                      <p>Last Fetched Page: {h.last_fetched_page}</p>
                      <p>Last Fetched Timestamp: {moment(h.last_fetched_timestamp).format('Do MMM, YYYY; HH:MM:SS A')}</p>
                      <p>Queue Started At: {moment(h.created_at).format('Do MMM, YYYY; HH:MM:SS A')}</p>
                    </div>
                  </div>
                </li>
              ))
            }
          </ul>
        </InfiniteScroll>
          </div>
        </section>
    </main>
  )
}

export default SearchHistory