import React from "react";
import "./App.scss";
import mutate from "immutability-helper";
import Button from "./components/button/Button";
import FieldSelector from "./components/field-selector/FieldSelector";
import Reports from "./components/reports/Reports";
import Filters from "./components/filters/Filters";
import Segments from "./components/segments/Segments";
import {ChartType, Flow, Group, Report, ReportFilter} from "./utils/types"
import Fields from "./components/fields/Fields";

interface AnalyticsProps {
  context: {
    flows: Flow[],
    groups: Group[],
    reports: Report[],
  }
}

interface AnalyticsState {
  groups: Group[],
  reports: Report[],
  filters: ReportFilter[],
  fields: any[],
  dirty: boolean,
  currentReport?: Report,
  currentGroupSegment?: any,
  lastGroupSegment?: any,
}

class Analytics extends React.Component<AnalyticsProps, AnalyticsState> {
  public constructor(props: AnalyticsProps) {
    super(props);

    this.state = {
      groups: this.props.context.groups,
      reports: this.props.context.reports,
      fields: [],
      filters: [],
      dirty: false,
    };
  }

  private saveNewReport() {
  }

  private saveReport() {
  }

  private handleReportSelected(report: Report) {
    this.setState({fields: report.config.fields, currentReport: report});
  }

  private handleSelectedFields(fields: { label: string, value: string }[]) {
    let idx = 0;
    let types = ['bar', 'donut', 'column'];
    let smallCharts = 0;
    let chartType: any = null;
    let chartSize = 1;
    let showDataTable = false;
    let showChoropleth = false;
    let newFields = [];

    for (const field of fields) {
      chartType = types[idx % types.length];
      chartSize = 1;
      showDataTable = false;
      showChoropleth = false;

      if (smallCharts > 0) {
        smallCharts--;
      } else {
        chartType = 'column';
        chartSize = 2;
        smallCharts = 2;

        if (idx > 0) {
          showDataTable = true;
        }
      }
      newFields.push(this.createField(field.value, 0, field.label, null, chartSize, chartType, showDataTable, showChoropleth));
      idx++;
    }
    newFields = newFields.filter(field => !!field);
    let modifiedFields: any = mutate(this.state.fields, {$push: [...newFields]});
    this.setState({fields: modifiedFields});
  }

  private createField(id: any, contacts: any, label: string, visible: boolean | null, chartSize = 2, chartType = ChartType.Bar, showDataTable = false, showChoropleth = false, delay = 0) {
    if (this.state.fields.find(field => field.id === id)) return null;
    let field: any = {
      id: id,
      label: label,
      isVisible: contacts === 0,
      isLoaded: false
    }

    field.isVisible = visible ? visible : field.isVisible;
    field.chartType = chartType
    field.chartSize = chartSize
    field.showDataTable = showDataTable
    field.showChoropleth = showChoropleth
    field.table = null
    field.chart = {
      segments: [],
      categories: [],
      chartType: chartType,
      total: 0
    }

    // todo: add code to load field data.
    // todo: add code to update chart.

    return field;
  }

  render() {
    return (
      <div className="analytics">
        <div className="controls">
          <Reports reports={this.state.reports} onReportSelected={this.handleReportSelected.bind(this)}></Reports>
          <FieldSelector flows={this.props.context.flows}
                         fields={this.state.fields}
                         onFieldsSelected={this.handleSelectedFields.bind(this)}
          ></FieldSelector>
          <Filters filters={this.state.filters}></Filters>
          <Segments></Segments>
          <Fields fields={this.state.fields}></Fields>
        </div>
        <div className="results">
          <div className="report-header">
            <div className="report-title">
              <div className="report-label">{this.state.currentReport?.text}</div>
              <div className="report-description">{this.state.currentReport?.description}</div>
            </div>
            <div className="control-buttons">
              <Button name={"Rename"} onClick={this.saveReport}></Button>
              <Button name={"New Report"} onClick={this.saveNewReport}></Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Analytics;
