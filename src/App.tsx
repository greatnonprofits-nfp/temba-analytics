import React from "react";
import "./App.scss";
import mutate from "immutability-helper";
import Button from "./components/button/Button";
import FieldSelector from "./components/field-selector/FieldSelector";
import Reports from "./components/reports/Reports";
import Filters from "./components/filters/Filters";
import Segments from "./components/segments/Segments";
import {ChartType, Field, Flow, Group, Report, ReportFilter, ReportSegment} from "./utils/types"
import Fields from "./components/fields/Fields";
import Controls from "./components/controls/Controls";
import Highcharts from "highcharts";
import {renderIf} from "./utils";
import FlowsPreview from "./components/flows-preview/FlowsPreview";
import Chart from "./components/chart/Chart";

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
  segments: ReportSegment[],
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
      segments: [],
      dirty: false,
    };
  }

  private saveNewReport() {
  }

  private saveReport() {
  }

  private handleReportSelected(report: Report) {
    this.setState({
      fields: report.config.fields,
      segments: report.config.segments,
      filters: report.config.filters,
      currentReport: report,
    });
  }

  private handleFieldUpdated(field: Field, idx?: number) {
    let fieldIdx = !!idx ? idx : this.state.fields.findIndex((_field: Field) => _field.id === field.id);
    let fields: any = mutate(this.state.fields, {[fieldIdx]: {$set: field}});
    this.setState({fields, dirty: true})
  }

  private handleFieldRemoved(field: Field) {
    let fieldIdx = this.state.fields.findIndex((_field: Field) => _field.id === field.id);
    let fields: any = mutate(this.state.fields, {$splice: [[fieldIdx, 1]]});
    this.setState({fields, dirty: true})
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
    this.setState({fields: modifiedFields, dirty: true});
  }

  private createField(id: any, contacts: any, label: string, visible: boolean | null, chartSize = 2, chartType = ChartType.Bar, showDataTable = false, showChoropleth = false, delay = 0) {
    if (this.state.fields.find(field => field.id === id)) return null;
    let field: Field = {
      id: id,
      label: label,
      isVisible: contacts === 0,
      isLoaded: false,
      chartType: chartType,
      chartSize: chartSize,
      showDataTable: showDataTable,
      showChoropleth: showChoropleth
    }

    field.isVisible = visible ? visible : field.isVisible;
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

  private handleGroupSegmentCreated() {
    let colors: any = Highcharts.getOptions().colors;
    let newSegment: ReportSegment = {
      label: "Contact Groups",
      isSegment: true,
      isGroupSegment: true,
      categories: this.state.groups.map((group: Group, idx) => {
        return {
          id: group.id,
          label: group.name,
          count: group.count,
          isSegment: false,
          color: colors[idx % colors.length]
        }
      })
    };
    let segments: any = this.state.segments;
    segments.forEach((_segment: ReportSegment) => _segment.isSegment = false);
    segments = mutate(this.state.segments, {$push: [newSegment]});
    this.setState({segments, dirty: true});
  }

  private handleGroupFilterCreated() {
    let newFilter: ReportFilter = {
      label: "Contact Groups",
      isActive: true,
      isGroupFilter: true,
      showAllContacts: true,
      categories: this.state.groups.map((group: Group) => {
        return {
          id: group.id,
          label: group.name,
          count: group.count,
          isFilter: false,
        }
      })
    };
    let filters: any = mutate(this.state.filters, {$push: [newFilter]});
    this.setState({filters, dirty: true});
  }

  private handleFilterCreated(filter: ReportFilter) {
    let filters: any = mutate(this.state.filters, {$push: [filter]});
    this.setState({filters, dirty: true});
  }

  private handleFilterUpdated(idx: number, filter: ReportFilter) {
    let filters: any = mutate(this.state.filters, {[idx]: {$set: filter}});
    this.setState({filters, dirty: true});
  }

  private handleFilterDeleted(idx: number) {
    let filters: any = mutate(this.state.filters, {$splice: [[idx, 1]]});
    this.setState({filters, dirty: true});
  }

  private handleSegmentCreated(segment: ReportSegment) {
    let segments: any = this.state.segments;
    segments.forEach((_segment: ReportSegment) => _segment.isSegment = false);
    segments = mutate(segments, {$push: [segment]});
    this.setState({segments, dirty: true});
  }

  private handleSegmentUpdated(idx: number, segment: ReportSegment) {
    let segments: any = this.state.segments;
    if (segment.isSegment) {
      segments.forEach((_segment: ReportSegment, segmentIdx: number) => {
        if (idx !== segmentIdx) _segment.isSegment = false;
      });
    }
    segments = mutate(segments, {[idx]: {$set: segment}});
    this.setState({segments, dirty: true});
  }

  private handleSegmentDeleted(idx: number) {
    let segments: any = mutate(this.state.segments, {$splice: [[idx, 1]]});
    this.setState({segments, dirty: true});
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
          {renderIf(this.state.fields.length !== 0)(
            <>
              <Filters
                filters={this.state.filters}
                onUpdateFilter={this.handleFilterUpdated.bind(this)}
                onDeleteFilter={this.handleFilterDeleted.bind(this)}
              ></Filters>
              <Segments
                segments={this.state.segments}
                onUpdateSegment={this.handleSegmentUpdated.bind(this)}
                onDeleteSegment={this.handleSegmentDeleted.bind(this)}
              ></Segments>
              <Fields
                fields={this.state.fields}
                onFieldRemoved={this.handleFieldRemoved.bind(this)}
                onFieldUpdated={this.handleFieldUpdated.bind(this)}
                onFilterCreated={this.handleFilterCreated.bind(this)}
                onSegmentCreated={this.handleSegmentCreated.bind(this)}
              ></Fields>
              {renderIf(this.state.groups.length > 0)(
                <div className={"contact-groups"}>
                  <div className="title">Contact Groups</div>
                  <Controls
                    onSegmentClicked={this.handleGroupSegmentCreated.bind(this)}
                    onFilterClicked={this.handleGroupFilterCreated.bind(this)}
                  ></Controls>
                </div>
              )}
            </>
          )}
        </div>
        <div className="results">
          {renderIf(this.state.fields.length !== 0)(
            <div className="report-header">
              <div className="report-title">
                <div className="report-label">{this.state.currentReport?.text}</div>
                <div className="report-description">{this.state.currentReport?.description}</div>
              </div>
              <div className="control-buttons">
                {renderIf(!!this.state.currentReport)(<Button name={"Rename"} onClick={this.saveReport}></Button>)}
                <Button name={"New Report"} onClick={this.saveNewReport}></Button>
              </div>
            </div>
          )}
          <div className="report-body">
            <FlowsPreview
              flows={this.props.context.flows}
              isVisible={this.state.fields.length === 0}
              onFieldsSelected={this.handleSelectedFields.bind(this)}
            ></FlowsPreview>
            <div className="charts">
              {this.state.fields.map((field: Field, idx: number) => (<Chart idx={idx} field={field} onFieldUpdated={this.handleFieldUpdated.bind(this)}></Chart>))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Analytics;
