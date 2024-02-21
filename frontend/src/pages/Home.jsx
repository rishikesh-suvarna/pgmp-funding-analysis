import React, { useEffect, useReducer, useState } from 'react'
import ApiService from '../services/ApiService'
import GrantCard from '../components/GrantCard'
import SearchInput from '../components/SearchInput'
import { Modal } from 'react-bootstrap'
import moment from 'moment'

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [modalData, setModalData] = useState({})
  const [show, setShow] = useState(false)
  
  const INITIAL_STATE = {
    query: null,
    data: [],
    page: 1,
    total: 0
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_QUERY':
        return { ...state, query: action.payload }
      case 'FETCH_DATA':
        return { ...state, data: action.payload.data, total: action.payload.total }
      case 'SET_DATA':
        return { ...state, data: action.payload }
      case 'SET_PAGE':
        return { ...state, page: action.payload }
      case 'RESET_DATA':
        return {...state, data: [], page: 1, total: 0}
      default:
        return state
    }
  }

  const [state, dispatchReducer] = useReducer(reducer, INITIAL_STATE)

  const requestKeywordData = async () => {
    try {
      setLoading(true)
      await ApiService.requestKeywordData(state.query)
      setTimeout(() => {
        fetchKeywordData()
        setLoading(false)
      }, 3000)
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
      let res = await ApiService.fetchKeywordData(state.query, state.page)
      console.log(res)
      dispatchReducer({ type: 'FETCH_DATA', payload: res })
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const actionButton = async (status, id) => {
    try {
      setLoading(true)
      await ApiService.setGrantStatus(status, id)
      // setData(data => data.filter(d => d.id !== id))
      dispatchReducer({type: 'SET_DATA', payload: state.data.filter(d => d.id !== id)})
    } catch (error) {
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const setQuery = (query) => {
    dispatchReducer({type: 'SET_QUERY', payload: query})
  }

  
  useEffect(() => {
    console.log('Running data useEffect')
    console.log(state.data.map(d => d.id))
    if((state.total > state.page * 10) && state.data.length < 5) {
      fetchKeywordData()
      // dispatchReducer({type: 'SET_PAGE', payload: parseInt(state.page) + 1})
    }
  }, [state.data])
  
  return (
    <main>
      <SearchInput 
        query={state.query}
        setQuery={setQuery}
        loading={loading}
        requestKeywordData={requestKeywordData}
      />
      {
        state.data.length 
        ?
          <section className="response py-3">
            <div className="container">
              <div className="h4">Grant Data</div>
              <div className="row">
                {
                  state.data.map(d => (
                    <GrantCard d={d} actionButton={actionButton} key={d.id} setModalData={setModalData} setShow={setShow} />
                  ))
                }
              </div>
            </div>
          </section>
        :
        null
      }
      <Modal show={show} onHide={() => setShow(false)} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title className='text-uppercase h6'>{modalData.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="card h-100">
          <div className="card-body">
            <p>{modalData.abstract}</p>
            <p>
              <b>Total Funding</b>: {modalData.total_funding?.toLocaleString({
                type: 'currency',
              })}
            </p>
            <p>
              <b>Start Date</b>: {moment(modalData.start_date).format('Do MMM, YYYY')}
            </p>
            <p>
              <b>End Date</b>: {moment(modalData.end_date).format('Do MMM, YYYY')}
            </p>
            <p>
              <b>Duration</b>: {moment(modalData.end_date).diff(moment(modalData.start_date), 'months')} months || {moment(modalData.end_date).diff(moment(modalData.start_date), 'days')} days
            </p>
            <small className="mb-3 d-inline-block">Approximately: {(Math.ceil(modalData.total_funding / (moment(modalData.end_date).diff(moment(modalData.start_date), 'days'))))?.toLocaleString({
              type: 'currency'
            })} / Day</small>
            {
              (modalData.status === 1)
              ?
                  <p>
                      <span className="badge bg-primary">SIGNED</span>
                  </p>
              :
                  <p>
                      <span className="badge bg-success">CLOSED</span>
                  </p>
            }
          </div>
        </div>
        </Modal.Body>
      </Modal>
    </main>
  )
}

export default Home