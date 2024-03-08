import React, { useEffect, useReducer, useState } from "react";
import ApiService from "../services/ApiService";
import GrantCard from "../components/GrantCard";
import SearchInput from "../components/SearchInput";
import { Modal } from "react-bootstrap";
import moment from "moment";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({});
  const [show, setShow] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [dataToShow, setDataToShow] = useState(0);

  const INITIAL_STATE = {
    query: [],
    data: [],
    page: 1,
    total: 0,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_QUERY":
        return { ...state, query: action.payload };
      case "FETCH_DATA":
        return {
          ...state,
          data: action.payload.data,
          total: action.payload.total,
        };
      case "SET_DATA":
        return { ...state, data: action.payload };
      case "SET_PAGE":
        return { ...state, page: action.payload };
      case "RESET_DATA":
        return { ...state, data: [], page: 1, total: 0 };
      default:
        return state;
    }
  };

  const [state, dispatchReducer] = useReducer(reducer, INITIAL_STATE);

  const fetchAllKeywords = async () => {
    try {
      let res = await ApiService.fetchAllKeywords();
      setKeywords(res);
    } catch (error) {
      console.log(error);
    }
  };

  const requestKeywordData = async () => {
    try {
      setLoading(true);
      await ApiService.requestKeywordData(state.query);
      await fetchKeywordData();
      await fetchAllKeywords();
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchKeywordData = async (status = 0) => {
    try {
      setLoading(true);
      let res = await ApiService.fetchKeywordData(state.query, status);
      dispatchReducer({ type: "FETCH_DATA", payload: res });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const actionButton = async (status, id) => {
    try {
      setLoading(true);
      await ApiService.setGrantStatus(status, id);
      // setData(data => data.filter(d => d.id !== id))
      dispatchReducer({
        type: "SET_DATA",
        payload: state.data.filter((d) => d.id !== id),
      });
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const setQuery = async (query) => {
    dispatchReducer({ type: "SET_QUERY", payload: query });
  };

  const setExistingKeyword = (e) => {
    dispatchReducer({ type: "SET_QUERY", payload: [...state.query, { label: e.target.value, value: e.target.value }] });
    // fetchKeywordData(e.target.value);
  };

  const changeOtherData = async (status) => {
    setDataToShow(parseInt(status));
    await fetchKeywordData(status);
  };

  useEffect(() => {
    console.log("Running data useEffect");
    console.log(state.data.map((d) => d.id));
    if (state.total > state.page * 12 && state.data.length < 5) {
      fetchKeywordData();
    }
  }, [state.data]);

  useEffect(() => {
    fetchAllKeywords();
  }, []);


  return (
    <main>
      <SearchInput
        query={state.query}
        setQuery={setQuery}
        loading={loading}
        requestKeywordData={requestKeywordData}
        keywords={keywords}
        setExistingKeyword={setExistingKeyword}
      />

      <section className="response py-3">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="h4 mb-0">Grant Data</div>
            <div className="form-group">
              <select
                className="form-control"
                value={dataToShow}
                onChange={(e) => changeOtherData(e.target.value)}
              >
                <option value={0} selected>
                  New Data
                </option>
                <option value={1}>Accepted Data</option>
                <option value={2}>Rejected False Positives</option>
              </select>
              <select
                className="form-control"
                value={dataToShow}
                onChange={(e) => changeOtherData(e.target.value)}
              >
                <option value={0} selected>
                  All Sources
                </option>
                <option value={1}>European Union</option>
                <option value={2}>National Science Foundation</option>
                <option value={3}>Gateway to Research</option>
              </select>
            </div>
          </div>
          {state.data.length ? (
            <div className="row">
              {state.data.map((d) => (
                <GrantCard
                  d={d}
                  actionButton={actionButton}
                  key={d.id}
                  setModalData={setModalData}
                  setShow={setShow}
                  dataToShow={dataToShow}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>
      <Modal show={show} onHide={() => setShow(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title className="text-uppercase h6">
            {modalData.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <div className="card h-100">
            <div className="card-body">
              <p>{modalData.abstract}</p>
              <p>
                <b>Total Funding</b>:{" "}
                {modalData.total_funding?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
              <p>
                <b>Start Date</b>:{" "}
                {moment(modalData.start_date).format("Do MMM, YYYY")}
              </p>
              <p>
                <b>End Date</b>:{" "}
                {moment(modalData.end_date).format("Do MMM, YYYY")}
              </p>
              <p>
                <b>Duration</b>:{" "}
                {moment(modalData.end_date).diff(
                  moment(modalData.start_date),
                  "months"
                )}{" "}
                months ||{" "}
                {moment(modalData.end_date).diff(
                  moment(modalData.start_date),
                  "days"
                )}{" "}
                days
              </p>
              <p><b>Grant Agency</b>: {modalData.api_service}</p>
              <small className="mb-3 d-inline-block">
                Approximately:{" "}
                {Math.ceil(
                  modalData.total_funding /
                    moment(modalData.end_date).diff(
                      moment(modalData.start_date),
                      "days"
                    )
                )?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}{" "}
                / Day
              </small>
              {modalData.status === 1 ? (
                <p>
                  <span className="badge bg-primary">SIGNED</span>
                </p>
              ) : (
                <p>
                  <span className="badge bg-success">CLOSED</span>
                </p>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </main>
  );
};

export default Home;
