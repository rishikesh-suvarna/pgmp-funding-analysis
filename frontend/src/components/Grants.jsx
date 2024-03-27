import React, { useEffect, useState } from "react";
import GrantCard from "./GrantCard";

const Grants = ({ actionButton, state, setModalData, setShow, dataToShow, setPage }) => {

  return (
    <div className="row">
      {state.data.map((d, index) => (
        <GrantCard
          d={d}
          actionButton={actionButton}
          key={d.id+'-'+index}
          setModalData={setModalData}
          setShow={setShow}
          dataToShow={dataToShow}
        />
      ))}
    </div>
  );
};

export default Grants;
