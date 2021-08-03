import React, {createRef} from "react";
import {ChartType, Field} from "../../utils/types";
import Highcharts from "highcharts";
import "./Chart.scss"

interface ChartProps {
  idx: number,
  field: Field,
  onFieldUpdated?: (field: Field, idx: number) => any,
}

interface ChartState {
}


export default class Chart extends React.Component<ChartProps, ChartState> {
  chartRef: any;
  containerRef: any;
  highchartsObject: any;
  resizeObserver: any;

  constructor(props: ChartProps) {
    super(props);
    this.state = {};
    this.chartRef = createRef();
    this.containerRef = createRef();
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate(prevProps: Readonly<ChartProps>, prevState: Readonly<ChartState>, snapshot?: any) {
    let field = this.props.field;
    this.highchartsObject.reflow();
    if (field.chartType !== ChartType.Donut) {
      this.highchartsObject.update({
        chart: {
          type: field.chartType
        }
      })
    } else {
      this.highchartsObject.update({
        chart: {
          type: 'pie',
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: true,
              distance: -50,
              style: {
                fontWeight: 'bold',
                color: 'white'
              }
            },
            startAngle: -90,
            endAngle: 270,
            size: '100%'
          }
        }
      })
    }
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
    // todo: refactor to use real data
    let options: any = {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Fruit Consumption'
      },
      xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges']
      },
      yAxis: {
        title: {
          text: 'Fruit eaten'
        }
      },
      series: [{
        name: 'Jane',
        data: [1, 0, 4]
      }, {
        name: 'John',
        data: [5, 7, 3]
      }]
    };
    this.highchartsObject = Highcharts.chart(this.chartRef.current, options);
  }

  private renderDataTable() {
    let field = this.props.field;
    if (field.showDataTable) {
      // todo: refactor to use real data
      let categories = [
        {
          label: "1",
          count: 13
        },
        {
          label: "2",
          count: 31
        },
        {
          label: "3",
          count: 2
        },
      ];
      let totalCount = categories.reduce((val, item) => val + item.count, 0);

      return (
        <table>
          {categories.map((category) => (
            <tr>
              <th>{category.label}</th>
              <td>{category.count}</td>

              <td>{
                // @ts-ignore
                parseInt((category.count / totalCount).toFixed(2) * 100)
              }%
              </td>
            </tr>
          ))}
        </table>
      )
    } else {
      return <></>;
    }
  }

  render() {
    let field: Field = this.props.field;
    return <div className={"chart-container" + (field.chartSize === 1 ? " small" : "")} ref={this.containerRef}>
      <div className={"chart-title"}>
        {field.label}
        <div className={"responses"}>{field.totalResponses || 0} responses</div>
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
      <div className={"chart"} ref={this.chartRef}/>
      <div className={"datatable"}>{this.renderDataTable()}</div>
    </div>;
  }
}