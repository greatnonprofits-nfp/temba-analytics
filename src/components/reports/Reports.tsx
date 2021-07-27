import React from "react";
import "./Reports.scss"

interface ReportsProps {
  reports: any[]
}

interface ReportsState {
}


export default class Reports extends React.Component<ReportsProps, ReportsState> {
  constructor(props: ReportsProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className="reports-container">
      <div className="title">Reports</div>
      <div className="inner-scroll">
        {this.props.reports.map((report: any) => (
          <div className="report-item">
            <div className="nav-item">
              <div className="name">
                {report.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>;
  }
}