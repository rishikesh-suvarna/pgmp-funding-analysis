import React from "react";
import moment from 'moment';

const GrantCard = ({d}) => {
  return (
    <div className="col-lg-4 mb-4">
      <div className="card h-100">
        <div className="card-body">
          <div className="card-title h6">{d.title}</div>
          <p>{d.abstract}</p>
          <p>
            <b>Total Funding</b>: {d.total_funding}
          </p>
          <p>
            <b>Start Date</b>: {moment(d.start_date).format('Do MMM, YYYY')}
          </p>
          <p>
            <b>End Date</b>: {moment(d.end_date).format('Do MMM, YYYY')}
          </p>
          <p>
            <b>Duration</b>: {moment(d.end_date).diff(moment(d.start_date), 'months')} months
          </p>
          {
            (d.status === 1)
            ?
                <p>
                    <span class="badge bg-primary">SIGNED</span>
                </p>
            :
                <p>
                    <span class="badge bg-success">CLOSED</span>
                </p>
          }
        </div>
        <div className="card-footer">
          <div className="d-flex align-items-center justify-content-between">
            <button className="btn btn-outline-success w-100 me-2">
              Approve
            </button>
            <button className="btn btn-outline-danger w-100">Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrantCard;
