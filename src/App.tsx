import React from 'react';
import './App.scss';
import Button from "./components/button/Button";
import FieldSelector from "./components/field-selector/FieldSelector";
import Reports from "./components/reports/Reports";
import Filters from "./components/filters/Filters";
import Segments from "./components/segments/Segments";

function App(context: any) {
  let testReports = [{name: "Report 1"}, {name: "Report 2"}]

  return (
    <div className="analytics">
      <div className="controls">
        <Reports reports={testReports}></Reports>
        <FieldSelector></FieldSelector>
        <Filters></Filters>
        <Segments></Segments>
      </div>
      <div className="results">
        <div className="report-header">
          <div className="report-title">
            <div className="report-label">Test Report</div>
            <div className="report-description">Test Description</div>
          </div>
          <div className="control-buttons">
            <Button name={"Save"} onClick={() => {}}></Button>
            <Button name={"Rename"} onClick={() => {}}></Button>
            <Button name={"New Report"} onClick={() => {}}></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
