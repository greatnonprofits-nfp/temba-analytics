import React from "react";
import "./Reports.scss"
import {renderIf} from "../../utils";
import {Report} from "../../utils/types";

interface ReportsProps {
  reports: Report[],
  onReportSelected: (report: Report) => any,
}

interface ReportsState {
  reports: Report[],
  currentReport: Report | null,
}


export default class Reports extends React.Component<ReportsProps, ReportsState> {
  constructor(props: ReportsProps) {
    super(props);
    this.state = {reports: this.props.reports, currentReport: null};
  }

  private isReportActive(report: Report) {
    let currentReport = this.state.currentReport
    if (currentReport !== null) {
      return currentReport.id === report.id;
    }
    return false;
  }

  private setReportActive(report: Report) {
    this.setState({currentReport: report});
    this.props.onReportSelected(report);
  }

  render() {
    return <div className="reports-container">
      {renderIf(this.state.reports.length > 0)(
        <>
          <div className="title">Reports</div>
          <div className="inner-scroll">
            {this.state.reports.map((report: Report, idx) => (
              <div
                key={idx}
                className={"report-item" + (this.isReportActive(report) ? " active" : "")}
                onClick={() => {
                  this.setReportActive(report);
                }}
              >
                <div className="nav-item">
                  <div className="name">
                    {report.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>;
  }
}