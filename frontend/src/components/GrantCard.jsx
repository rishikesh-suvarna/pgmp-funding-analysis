import React from "react";
import moment from 'moment';

const GrantCard = ({d, actionButton, setModalData, setShow, dataToShow}) => {

  const openModal = () => {
    setModalData(d)
    setShow(true)
  }

  return (
    <div className="col-lg-4 mb-4">
      <div className="card h-100">
      <button className="btn p-0 text-start" onClick={openModal}>
        <div className="card-header p-3">
          <div className="card-title h6 text-uppercase mb-0">{d.title}</div>
        </div>
      </button>
        <div className="card-body">
          {/* <p>{d.abstract.substring(0, 120)}...</p> */}
          <p>
            <b>Total Funding</b>: {d.total_funding?.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            })}
          </p>
          <p>
            <b>Start Date</b>: {moment(d.start_date).format('Do MMM, YYYY')}
          </p>
          <p>
            <b>End Date</b>: {moment(d.end_date).format('Do MMM, YYYY')}
          </p>
          <p>
            <b>Duration</b>: {moment(d.end_date).diff(moment(d.start_date), 'months')} months || {moment(d.end_date).diff(moment(d.start_date), 'days')} days
          </p>
          <p><b>Grant Agency</b>: {d.api_service}</p>
          <p><b>Keyword</b>: {d.keywords.map(k => k.keyword).join(',')}</p>
          <small className="mb-3 d-inline-block">Approximately: {(Math.ceil(d.total_funding / (moment(d.end_date).diff(moment(d.start_date), 'days'))))?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          })} / Day</small>
          {
            (d.status !== null)
            ?
              <div className="">
                {
                  (d.status === 1)
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
            :
            null
          }
          {
            !d.relevance_score
            ?
              <p className="relevance_score">
                <span className={`badge bg-secondary`}>Keyword Relevance Score: N/A</span>
              </p>
            :
              <p className="relevance_score">
                <span className={`badge ${d.relevance_score > 20 ? 'bg-primary' : 'bg-danger'}`}>Keyword Relevance Score: {d.relevance_score}%</span>
              </p>
          }
        </div>
        {
          (dataToShow === 0)
          ?
          <div className="card-footer">
            <div className="d-flex align-items-center justify-content-between">
              <button className="btn btn-outline-success w-100 me-2" onClick={() => actionButton(1, d.id)}>
                Approve
              </button>
              <button className="btn btn-outline-danger w-100" onClick={() => actionButton(2, d.id)}>Reject</button>
            </div>
          </div>
          :
          null
        }
      </div>
    </div>
  );
};

export default GrantCard;
