import React from "react";
import "./Reports.scss"
import {renderIf} from "../../utils";
import {Report} from "../../utils/types";
import Controls from "../controls/Controls";
import mutate from "immutability-helper";

interface ReportsProps {
  reports: Report[],
  onReportSelected: (report: Report) => any,
  onReportDeleted: (report: Report) => any,
  readonly?: boolean,
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

  componentWillReceiveProps(nextProps: ReportsProps) {
    this.setState({reports: nextProps.reports});
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

  private onReportRemove(idx: number, report: Report) {
    if (!!this.props.onReportDeleted) {
      let reports: any = mutate(this.state.reports, {$splice: [[idx, 1]]});
      this.setState({reports});
      this.props.onReportDeleted(report);
    }
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
              >
                <div
                  className="name"
                  onClick={() => {
                    this.setReportActive(report);
                  }}
                >
                  {report.text}
                </div>
                {renderIf(!this.props.readonly) (
                  <Controls onRemoveClicked={() => this.onReportRemove(idx, report)}/>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>;
  }
}