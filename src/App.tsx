import React from "react";
import "./App.scss";
import mutate from "immutability-helper";
import Button from "./components/button/Button";
import FieldSelector from "./components/field-selector/FieldSelector";
import Reports from "./components/reports/Reports";
import Filters from "./components/filters/Filters";
import Segments from "./components/segments/Segments";
import {
  ChartType, DataStatus,
  Field,
  Flow,
  FlowRuleCategory,
  Group,
  Report,
  ReportFilter,
  ReportSegment
} from "./utils/types"
import Fields from "./components/fields/Fields";
import Controls from "./components/controls/Controls";
import Highcharts from "highcharts";
import {getRequestHeaders, renderIf} from "./utils";
import FlowsPreview from "./components/flows-preview/FlowsPreview";
import Chart from "./components/chart/Chart";
import SaveDialog from "./components/save-dialog/SaveDialog";
import axios from "axios";
import StatusDialog from "./components/status-dialog/StatusDialog";
import GearMenu from "./components/gear-menu/GearMenu";
import GearMenuItem from "./components/gear-menu/GearMenuItem";

interface AnalyticsProps {
  context: {
    flows: Flow[],
    groups: Group[],
    reports: Report[],
    data_status: DataStatus,
    readonly?: boolean,
    endpoints: {
      createUpdateReport: string,
      deleteReport: string,
      loadChartsData: string,
      refreshChartsData: string,
    }
  }
}

interface AnalyticsState {
  groups: Group[],
  reports: Report[],
  filters: ReportFilter[],
  segments: ReportSegment[],
  fields: Field[],
  dirty: boolean,
  currentReport?: Report,
  currentGroupSegment?: any,
  lastGroupSegment?: any,
  isChartDataLoaded: boolean,
  saveDialog: {
    title?: string,
    description?: string,
    isVisible: boolean,
    successCallback?: (title: string, description: string) => any,
  },
  statusDialog: {
    context: DataStatus,
    isVisible: boolean,
  }
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
      saveDialog: {isVisible: false},
      statusDialog: {isVisible: false, context: this.props.context.data_status},
      isChartDataLoaded: true,
    };
  }

  private saveNewReport() {
    this.setState({
      saveDialog: {
        title: "",
        description: "",
        isVisible: true,
        successCallback: (title, description) => {
          let report: Report = {
            text: title,
            description: description,
            config: {
              fields: this.state.fields,
              filters: this.state.filters,
              segments: this.state.segments,
            }
          }
          axios.post(
            this.props.context.endpoints.createUpdateReport, report, {headers: getRequestHeaders()}
          ).then((response) => {
            if (response.data.status === "success") {
              let reports: any = mutate(this.state.reports, {$push: [response.data.report]});
              this.setState({
                reports,
                currentReport: response.data.report,
                dirty: false,
              });
            }
          }).catch((error) => {
            console.error(error)
          });
        }
      }
    });
  }

  private saveReport() {
    this.setState({
      saveDialog: {
        title: this.state.currentReport?.text,
        description: this.state.currentReport?.description,
        isVisible: true,
        successCallback: (title, description) => {
          if (!!this.state.currentReport) {
            let report: Report = {
              id: this.state.currentReport.id,
              text: title,
              description: description,
              config: {
                fields: this.state.fields,
                filters: this.state.filters,
                segments: this.state.segments,
              }
            }
            axios.post(
              this.props.context.endpoints.createUpdateReport, report, {headers: getRequestHeaders()}
            ).then((response) => {
              if (response.data.status === "success") {
                let reports: any = this.state.reports;
                let currentReportIdx = reports.findIndex((_report: Report) => _report.id === report.id);
                reports = mutate(reports, {[currentReportIdx]: {$set: report}});
                this.setState({
                  reports,
                  currentReport: report,
                  dirty: false,
                });
              }
            }).catch((error) => {
              console.error(error)
            });
          }
        }
      }
    });
  }

  private handleReportSelected(report: Report) {
    this.setState({
      fields: report.config.fields,
      segments: report.config.segments,
      filters: report.config.filters,
      currentReport: report,
      dirty: false,
      isChartDataLoaded: false
    });
    this.loadChartDataForFields(report.config.fields, report.config.filters, report.config.segments);
  }

  private handleReportRemoved(report: Report) {
    let reportIdx = this.state.reports.findIndex((_report: Report) => _report.id === report.id);
    let reports: any = mutate(this.state.reports, {$splice: [[reportIdx, 1]]});
    this.setState({reports});
    if (this.props.context.endpoints.deleteReport.length > 0) {
      axios.delete(this.props.context.endpoints.deleteReport, {
        headers: getRequestHeaders(),
        data: {
          report_id: report.id,
        }
      }).catch(() => {
      });
    }
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

  private createField(id: any, contacts: any, label: string, visible: boolean | null, chartSize = 2, chartType = ChartType.Bar, showDataTable = false) {
    if (this.state.fields.find(field => field.id === id)) return null;
    let field: Field = {
      id: id,
      label: label,
      isVisible: contacts === 0,
      chartType: chartType,
      chartSize: chartSize,
      showDataTable: showDataTable,
    }

    field.isVisible = visible ? visible : field.isVisible;
    return field;
  }

  private loadChartDataForFields(_fields: Field[], _filters: ReportFilter[], _segments: ReportSegment[], extraState = {}) {
    // prepare request data
    let filters = {
      values: _filters.filter(filter => filter.isActive && !filter.isGroupFilter).map(filter => {
        return {
          field: filter.fieldId,
          categories: filter.categories.filter(category => category.isFilter).map(category => category.label),
          excludedCategories: filter.categories.filter(category => category.isFilter === false).map(category => category.label)
        }
      }),
      groups: _filters.filter(filter => filter.isActive && filter.isGroupFilter && !filter.showAllContacts).map(filter => {
        return filter.categories.filter(category => category.isFilter).map(category => category.id);
      })
    };
    let activeSegment = _segments.find(segment => segment.isSegment);
    let segment: any = !!activeSegment ? {
      field: activeSegment.fieldId,
      isGroupSegment: activeSegment.isGroupSegment,
      categories: activeSegment.categories.filter(category => category.isSegment).map(category => {
        return {
          id: category.id,
          label: category.label,
        }
      }),
    } : {};
    let fields = _fields.filter((field: Field) => field.isVisible).map((field: Field) => {
      return {id: field.id}
    });

    // request necessary data
    if (!this.props.context.endpoints.loadChartsData) return;
    axios.post(this.props.context.endpoints.loadChartsData, {fields, filters, segment}, {
      headers: getRequestHeaders()
    }).then((response) => {
      let fields_categories: { id: { flow: number, rule: string }, categories: FlowRuleCategory[] }[] = response.data;
      _fields.forEach((field: Field) => {
        let field_categories = fields_categories
          .find(item => item.id.flow === field.id.flow && item.id.rule === field.id.rule);
        if (field_categories) {
          field.categories = field_categories.categories;
        }
      });
      this.setState({fields: _fields, isChartDataLoaded: true, ...extraState});
    }).catch(reason => console.error(reason));
  }

  private handleSelectedFields(fields: { label: string, value: string }[]) {
    let idx = 0;
    let types = ['bar', 'donut', 'column'];
    let smallCharts = 0;
    let chartType: any = null;
    let chartSize = 1;
    let showDataTable = false;
    let newFields = [];

    for (const field of fields) {
      chartType = types[idx % types.length];
      chartSize = 1;
      showDataTable = false;

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
      newFields.push(this.createField(field.value, 0, field.label, null, chartSize, chartType, showDataTable));
      idx++;
    }
    newFields = newFields.filter(field => !!field);
    let modifiedFields: any = mutate(this.state.fields, {$push: [...newFields]});
    this.setState({fields: modifiedFields, dirty: true, isChartDataLoaded: false});
    this.loadChartDataForFields(modifiedFields, this.state.filters, this.state.segments);
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
          isSegment: true,
          color: colors[idx % colors.length]
        }
      })
    };
    let segments: any = this.state.segments;
    segments.forEach((_segment: ReportSegment) => _segment.isSegment = false);
    segments = mutate(this.state.segments, {$push: [newSegment]});
    this.setState({segments, dirty: true, isChartDataLoaded: false});
    this.loadChartDataForFields(this.state.fields, this.state.filters, segments);
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
          isFilter: null,
        }
      })
    };
    let filters: any = mutate(this.state.filters, {$push: [newFilter]});
    this.setState({filters, dirty: true, isChartDataLoaded: false});
    this.loadChartDataForFields(this.state.fields, filters, this.state.segments);
  }

  private handleFilterCreated(filter: ReportFilter) {
    let filters: any = mutate(this.state.filters, {$push: [filter]});
    this.setState({filters, dirty: true, isChartDataLoaded: false});
    this.loadChartDataForFields(this.state.fields, filters, this.state.segments);
  }

  private handleFilterUpdated(idx: number, filter: ReportFilter) {
    let filters: any = mutate(this.state.filters, {[idx]: {$set: filter}});
    this.setState({filters, dirty: true, isChartDataLoaded: false});
    this.loadChartDataForFields(this.state.fields, filters, this.state.segments);
  }

  private handleFilterDeleted(idx: number) {
    let filters: any = mutate(this.state.filters, {$splice: [[idx, 1]]});
    this.setState({filters, dirty: true, isChartDataLoaded: false});
    this.loadChartDataForFields(this.state.fields, filters, this.state.segments);
  }

  private handleSegmentCreated(segment: ReportSegment) {
    let segments: any = this.state.segments;
    segments.forEach((_segment: ReportSegment) => _segment.isSegment = false);
    segments = mutate(segments, {$push: [segment]});
    this.setState({segments, dirty: true, isChartDataLoaded: false});
    this.loadChartDataForFields(this.state.fields, this.state.filters, segments);
  }

  private handleSegmentUpdated(idx: number, segment: ReportSegment) {
    let segments: any = this.state.segments;
    if (segment.isSegment) {
      segments.forEach((_segment: ReportSegment, segmentIdx: number) => {
        if (idx !== segmentIdx) _segment.isSegment = false;
      });
    }
    segments = mutate(segments, {[idx]: {$set: segment}});
    this.setState({segments, dirty: true, isChartDataLoaded: false});
    this.loadChartDataForFields(this.state.fields, this.state.filters, segments);
  }

  private handleSegmentDeleted(idx: number) {
    let segments: any = mutate(this.state.segments, {$splice: [[idx, 1]]});
    this.setState({segments, dirty: true, isChartDataLoaded: false});
    this.loadChartDataForFields(this.state.fields, this.state.filters, segments);
  }

  private handleOnShowRefreshClicked() {
    let statusDialogState = this.state.statusDialog;
    statusDialogState.isVisible = !statusDialogState.isVisible;
    this.setState({statusDialog: statusDialogState});
  }

  private renderDataStatusDialog() {
    return (
      <StatusDialog
        refreshUrl={this.props.context.endpoints.refreshChartsData}
        dataStatus={this.state.statusDialog.context}
        isVisible={this.state.statusDialog.isVisible}
        onStateChanged={(dataStatus, isVisible, refreshFields) => {
          if (!!refreshFields) {
            this.loadChartDataForFields(
              this.state.fields, this.state.filters, this.state.segments, {
                statusDialog: {
                  isVisible,
                  context: dataStatus
                }
              },
            );
          } else {
            this.setState({statusDialog: {isVisible, context: dataStatus}});
          }
        }}
      />
    );
  }

  private renderSaveReportDialog() {
    return (
      <SaveDialog
        show={this.state.saveDialog.isVisible}
        title={this.state.saveDialog?.title}
        description={this.state.saveDialog?.description}
        onSubmit={this.state.saveDialog.successCallback?.bind(this)}
        onCancel={() => {
          this.setState({saveDialog: {isVisible: false}});
        }}
        existingTitles={(() => {
          let reportNames = this.state.reports.map((report) => report.text);
          if (!!this.state.saveDialog.title) {
            reportNames = reportNames.filter(name => name !== this.state.saveDialog.title);
          }
          return reportNames;
        })()}
      />
    )
  }

  private getGroupedFields() {
    return Object.entries(this.state.fields.reduce((accu: any, field, actualIdx) => {
      let flow = field.id.flow;
      if (!accu[flow]) {
        accu[flow] = [];
      }
      accu[flow].push([actualIdx, field]);
      return accu
    }, {}));
  }

  render() {
    if (!this.state.statusDialog.context.lastUpdated) {
      return <div className="analytics">
        <div className="results full-size">
          <div className="report-header">
            <div className="report-title">
              <div className="report-label">No data to show</div>
              <div className="report-description">Please check the sync process</div>
            </div>
            {renderIf(!this.props.context.readonly)(
              <div className="control-buttons">
                <div
                  className={"status-btn"}
                  onClick={this.handleOnShowRefreshClicked.bind(this)}
                ><i className="fas fa-sync"/></div>
                {this.renderDataStatusDialog()}
              </div>
            )}
          </div>
        </div>
      </div>
    }
    return (
      <div className="analytics">
        <div className="controls">
          <Reports
            reports={this.state.reports}
            onReportSelected={this.handleReportSelected.bind(this)}
            onReportDeleted={this.handleReportRemoved.bind(this)}
            readonly={this.props.context.readonly}
          />
          <FieldSelector flows={this.props.context.flows}
                         fields={this.state.fields}
                         onFieldsSelected={this.handleSelectedFields.bind(this)}
          />
          {renderIf(this.state.fields.length !== 0)(
            <>
              <Filters
                filters={this.state.filters}
                onUpdateFilter={this.handleFilterUpdated.bind(this)}
                onDeleteFilter={this.handleFilterDeleted.bind(this)}
              />
              <Segments
                segments={this.state.segments}
                onUpdateSegment={this.handleSegmentUpdated.bind(this)}
                onDeleteSegment={this.handleSegmentDeleted.bind(this)}
              />
              <Fields
                fields={this.state.fields}
                flows={this.props.context.flows}
                onFieldRemoved={this.handleFieldRemoved.bind(this)}
                onFieldUpdated={this.handleFieldUpdated.bind(this)}
                onFilterCreated={this.handleFilterCreated.bind(this)}
                onSegmentCreated={this.handleSegmentCreated.bind(this)}
              />
              {renderIf(this.state.groups.length > 0)(
                <div className={"contact-groups"}>
                  <div className="title">Contact Groups</div>
                  <Controls
                    onSegmentClicked={this.handleGroupSegmentCreated.bind(this)}
                    onFilterClicked={this.handleGroupFilterCreated.bind(this)}
                  />
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
              {renderIf(!this.props.context.readonly)(
                <div className="control-buttons">
                  <GearMenu>
                    <GearMenuItem title={"Refresh Data"} onItemClicked={this.handleOnShowRefreshClicked.bind(this)}/>
                    <GearMenuItem title={"New Report"} onItemClicked={this.saveNewReport.bind(this)}/>
                    <GearMenuItem title={`${this.state.dirty ? "Save" : "Rename"} Report`} onItemClicked={this.saveReport.bind(this)} hidden={!this.state.currentReport}/>
                    <GearMenuItem title={"Manage Flows"} onItemClicked={() => {}}/>
                  </GearMenu>
                </div>
              )}
              {this.renderDataStatusDialog()}
              {this.renderSaveReportDialog()}
            </div>
          )}
          <div className="report-body">
            <FlowsPreview
              flows={this.props.context.flows}
              isVisible={this.state.fields.length === 0}
              onFieldsSelected={this.handleSelectedFields.bind(this)}
            />
            <div className="charts">
              {this.getGroupedFields().map(([flowId, fields], idx) => {
                let flow = this.props.context.flows.find((flow) => flow.id.toString() === flowId);
                return <div key={idx} className={"flow-charts"}>
                  {!!flow ? <div className={"flow-title"}>{flow.text}</div> : ""}
                  <div className={"flow-body"}>
                    {
                      // @ts-ignore
                      fields.filter(([_, field]) => field.isVisible).map(([fieldIdx, field], keyIdx) => (
                        <Chart key={keyIdx}
                               idx={fieldIdx}
                               field={field}
                               isLoaded={this.state.isChartDataLoaded}
                               onFieldUpdated={this.handleFieldUpdated.bind(this)}
                        />
                      ))
                    }
                  </div>
                </div>;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Analytics;
