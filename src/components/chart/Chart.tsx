import React, {createRef} from "react";
import {ChartType, Field} from "../../utils/types";
import Highcharts from "highcharts";
import "./Chart.scss"
import {renderIf} from "../../utils";

interface SeriesData {
  name: string,
  color: string,
  total?: number,
  y: any,
}

interface NestedSeriesData {
  name: string,
  data: SeriesData[],
}

interface ChartProps {
  idx: number,
  field: Field,
  isLoaded: boolean,
  onFieldUpdated?: (field: Field, idx: number) => any,
}

interface ChartState {
  totalResponses: number;
}


export default class Chart extends React.Component<ChartProps, ChartState> {
  chartRef: any;
  containerRef: any;
  highchartsObject: any;
  resizeObserver: any;

  constructor(props: ChartProps) {
    super(props);
    this.chartRef = createRef();
    this.containerRef = createRef();
    this.state = {totalResponses: this.getTotalResponses(this.props)};
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate(prevProps: Readonly<ChartProps>, prevState: Readonly<ChartState>, snapshot?: any) {
    if (this.props.isLoaded) {
      try {
        if (this.highchartsObject) {
          this.highchartsObject.destroy();
          delete this.highchartsObject;
        }
      } catch (e) {
        console.error(e);
      }
      this.renderChart();
    }
  }

  componentWillReceiveProps(nextProps: Readonly<ChartProps>, nextContext: any) {
    this.setState({totalResponses: this.getTotalResponses(nextProps)});
  }

  private getTotalResponses(props: any) {
    let totalResponses = 0;
    let field: Field = props.field;
    let hasInnerCategories = !!field.categories ? (field.categories.length > 0 ? !!field.categories[0].categories : false) : false;
    if (!!field.categories) {
      if (hasInnerCategories) {
        totalResponses = field.categories.reduce((val, category) => {
          return val + (category.categories?.reduce((innerVal, item) => innerVal + (item.count || 0), 0) || 0);
        }, 0);
      } else {
        totalResponses = field.categories.reduce((val, item) => val + (item.count || 0), 0);
      }
    }
    return totalResponses;
  }

  private prepareChartsData() {
    let colors: any = Highcharts.getOptions().colors;
    let field = this.props.field;
    let categories: string[] = [];
    let series: NestedSeriesData[] = [];
    let hasInnerCategories = !!field.categories ? (field.categories.length > 0 ? !!field.categories[0].categories : false) : false;
    if (hasInnerCategories) {
      field.categories?.forEach((segmentCategory, idx) => {
        let seriesData: SeriesData[] = [];
        let totalResponses = (segmentCategory.categories ?? []).reduce((val, item) => val + (item.count || 0), 0);
        categories = [];
        segmentCategory.categories?.forEach((fieldCategory) => {
          categories.push(fieldCategory.label);
          seriesData.push({
            name: fieldCategory.label,
            color: colors[idx % colors.length],
            total: totalResponses,
            y: fieldCategory.count
          });
        });
        series.push({
          name: segmentCategory.label,
          data: seriesData
        })
      });
    } else {
      let seriesData: SeriesData[] = [];
      let totalResponses = this.state.totalResponses;
      field.categories?.forEach((fieldCategory, idx) => {
        categories.push(fieldCategory.label);
        seriesData.push({
          name: fieldCategory.label,
          color: colors[idx % colors.length],
          total: totalResponses,
          y: fieldCategory.count,
        })
      });
      series.push({
        name: "All Responses",
        data: seriesData,
      })
    }
    return {categories, series, colors};
  }

  private renderChartSizeControl(size: number) {
    let field = this.props.field;
    let currentSize = this.props.field.chartSize;
    return <div
      className={"chart-size chart-size-" + size + (size === currentSize ? " active" : "")}
      onClick={() => {
        if (size !== currentSize && !!this.props.onFieldUpdated) {
          field.chartSize = size;
          this.props.onFieldUpdated(field, this.props.idx);
        }
      }}
    />
  }

  private renderChartTypeControl(type: ChartType, iconStyle: string) {
    let field = this.props.field;
    let currentType = this.props.field.chartType;
    return <div
      className={"chart-type" + (type === currentType ? " active" : "")}
      onClick={() => {
        if (type !== currentType && !!this.props.onFieldUpdated) {
          field.chartType = type;
          this.props.onFieldUpdated(field, this.props.idx);
        }
      }}
    >
      <i className={iconStyle}/>
    </div>;
  }

  private renderChart() {
    let field = this.props.field;
    if (!field.categories || field.categories.length === 0) return;
    let chartsData = this.prepareChartsData();
    let options: any = {
      chart: {
        type: field.chartType === ChartType.Donut ? 'pie' : field.chartType,
      },
      plotOptions: {
        bar: {
          colorByPoint: true,
          shadow: false,
        },
        column: {
          colorByPoint: true,
          shadow: false,
        },
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          size: '100%',
          innerSize: field.chartType === ChartType.Donut ? '50%' : '0%',
          dataLabels: {
            enabled: true,
            color: "#888",
            connectorColor: "#888",
            style: {textShadow: "none"},
            formatter: function (): any {
              // @ts-ignore
              return this.point.percentage <= 0 ? null : `<b>${this.point.name}</b> ${Math.round(this.point.percentage)}%`;
            }
          }
        }
      },
      title: {
        text: ''
      },
      tooltip: {
        formatter: function (): any {
          // @ts-ignore
          return `<b>${this.key}</b>: ${this.y}`;
        }
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        labels: {
          style: {
            fontWeight: '200'
          }
        },
        categories: chartsData.categories,
      },
      yAxis: {
        allowDecimals: false,
        labels: {enabled: false},
        title: {text: ''},
      },
      series: [],
    };
    if (chartsData.series.length > 1) {
      options.plotOptions.bar.colorByPoint = false;
      options.plotOptions.column.colorByPoint = false;
      options.tooltip.formatter = function (): any {
        // @ts-ignore
        return `<b>${this.series.name} - ${this.key}</b>: ${this.y}`;
      }
    }
    let seriesCount = chartsData.series.length;
    let innerSize = field.chartType === "donut" ? 35 : 0;
    let sizeStep = (100 - innerSize) / (seriesCount || 1);
    let lastSize = 100;
    chartsData.series.forEach((seriesItem, seriesIdx) => {
      if (field.chartType === "pie" || field.chartType === "donut") {
        let pieSeries: any = seriesItem;
        if (seriesCount > 1) {
          pieSeries.size = lastSize + "%";
          innerSize = lastSize - sizeStep;
          lastSize = innerSize;

        }
        pieSeries.innerSize = `${innerSize}%`;
        options.series.push(pieSeries);
      } else if (field.chartType === "bar" || field.chartType === "column") {
        options.series.push(seriesItem);
      }
    });
    this.highchartsObject = Highcharts.chart(this.chartRef.current, options);
  }

  private renderDataTable(totalResponses = 0) {
    let field = this.props.field;
    if (field.showDataTable && field.categories) {
      let hasInnerCategories = !!field.categories ? (field.categories.length > 0 ? !!field.categories[0].categories : false) : false;
      if (hasInnerCategories) {
        let totals: any = {};
        let reversedCategories: any = {};
        field.categories.forEach(segmentCategory => {
          // @ts-ignore
          totals[segmentCategory.label] = segmentCategory.categories.reduce((val, item) => val + (item.count || 0), 0);
          segmentCategory.categories?.forEach(category => {
            if (reversedCategories.hasOwnProperty(category.label)) {
              reversedCategories[category.label].push({label: segmentCategory.label, count: category.count});
            } else {
              reversedCategories[category.label] = [{label: segmentCategory.label, count: category.count}];
            }
          });
        });
        return (
          <table>
            <thead>
            <tr>
              <th></th>
              {field.categories.map(
                (category, idx) => <th
                  key={idx}
                  colSpan={2}
                  className={"datatable-segment" + (idx % 2 !== 0 ? " odd" : "")}
                >{category.label}</th>
              )}
            </tr>
            </thead>
            <tbody>
            {
              // @ts-ignore
              Object.entries(reversedCategories).map(([category, segments], idx) => {
                return (
                  <tr key={idx}>
                    <th className={"text-left"}>{category}</th>
                    { // @ts-ignore
                      segments.map((segment: any, idx: number) => <React.Fragment key={idx}>
                        <td className={"datatable-segment" + (idx % 2 !== 0 ? " odd" : "")}>{segment.count}</td>
                        <td className={"datatable-segment" + (idx % 2 !== 0 ? " odd" : "")}>{
                          // @ts-ignore
                          parseInt((segment.count / totals[segment.label] || 0).toFixed(2) * 100)
                        }%
                        </td>
                      </React.Fragment>)
                    }
                  </tr>
                )
              })
            }
            </tbody>
          </table>
        )
      } else if (totalResponses) {
        return (
          <table>
            <tbody>
            {field.categories.map((category, idx) => (
              <tr key={idx}>
                <th className={"text-left"}>{category.label}</th>
                <td className={"datatable-segment"}>{category.count}</td>
                <td className={"datatable-segment"}>{
                  // @ts-ignore
                  parseInt((category.count / totalResponses).toFixed(2) * 100)
                }%
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        )
      }
    }
    return <></>;
  }

  render() {
    let field: Field = this.props.field;
    let totalResponses = this.state.totalResponses;
    return <div className={"chart-container" + (field.chartSize === 1 ? " small" : "")} ref={this.containerRef}>
      <div className={"chart-title"}>
        {field.label}
        {renderIf(!!totalResponses)(<div className={"responses"}>{totalResponses} responses</div>)}
      </div>
      <div className={"chart-options"}>
        <div className={"chart-sizes"}>
          {this.renderChartSizeControl(1)}
          {this.renderChartSizeControl(2)}
        </div>
        <div className={"chart-types"}>
          {this.renderChartTypeControl(ChartType.Bar, "fas fa-signal rotated-signal")}
          {this.renderChartTypeControl(ChartType.Pie, "fas fa-chart-pie center-circle")}
          {this.renderChartTypeControl(ChartType.Column, "fas fa-chart-bar")}
          {this.renderChartTypeControl(ChartType.Donut, "fas fa-circle-notch center-circle")}
          <div className={"chart-type toggle-data-table" + (field.showDataTable ? " active" : "")} onClick={() => {
            if (!!this.props.onFieldUpdated) {
              field.showDataTable = !field.showDataTable;
              this.props.onFieldUpdated(field, this.props.idx);
            }
          }}
          >
            <i className={"fas fa-bars"}/>
          </div>
        </div>
      </div>
      <div className={"chart"} ref={this.chartRef}>There is no data to display.</div>
      <div className={"datatable"}>{this.renderDataTable(totalResponses)}</div>
    </div>;
  }
}