import React from "react";
import {Flow} from "../../utils/types";
import "./FlowsPreview.scss"
import moment from "moment";

interface FlowsPreviewProps {
  flows: Flow[],
  onFieldsSelected?: (fields: any[]) => any;
  isVisible: boolean,
}

interface FlowsPreviewState {
  active: Flow[],
  recent: Flow[],
}


export default class FlowsPreview extends React.Component<FlowsPreviewProps, FlowsPreviewState> {
  constructor(props: FlowsPreviewProps) {
    super(props);
    this.state = {
      active: this.props.flows.sort((a, b) => {
        let c = ((a.stats.runs || 0) - (b.stats.runs || 0)) * -1;
        c = c !== 0 ? c : ((new Date(a.stats.created_on).getTime() - new Date(b.stats.created_on).getTime()) * -1);
        return c
      }).slice(0, 4),
      recent: this.props.flows.sort((a, b) => {
        return (new Date(a.stats.created_on).getTime() - new Date(b.stats.created_on).getTime()) * -1
      }).slice(0, 4),
    };
  }

  private handleFlowClicked(flow: Flow) {
    if (!!this.props.onFieldsSelected) {
      let fields = flow.rules.map((rule) => {
        return {label: rule.text, value: {flow: flow.id, rule: rule.id}}
      });
      this.props.onFieldsSelected(fields);
    }
  }

  private renderPluralizedFields(fieldsCount: number) {
    switch (fieldsCount) {
      case 0:
        return <>No fields</>
      case 1:
        return <>1 field</>
      default:
        return <>{fieldsCount} fields</>
    }
  }

  private renderDate(dateString: string) {
    let date = moment(dateString);
    return <>{date.format("MMM DD, YYYY")}</>
  }

  private renderFlow(flow: Flow) {
    return <div className={"flow-item"}>
      <div className={"runs-data"}>
        <div className={"counter clickable"} onClick={() => {this.handleFlowClicked(flow)}}>{flow.stats.runs}</div>
        runs
      </div>
      <div className={"main-data"}>
        <div className={"flow-label clickable"} onClick={() => {this.handleFlowClicked(flow)}}>{flow.text}</div>
        <div className={"flow-fields"}>{this.renderPluralizedFields(flow.rules.length)}</div>
        <div className={"flow-created"}>Created on {this.renderDate(flow.stats.created_on)}</div>
      </div>
    </div>
  }

  render() {
    if (!this.props.isVisible) return <></>;
    return <div className={"flows-preview-container"}>
      <div className="most-active">
        <div className="title">Most Active</div>
        <div className="flows">{
          this.state.active.map((flow: Flow, idx: number) => (<div key={idx}>{this.renderFlow(flow)}</div>))
        }</div>
      </div>
      <div className="most-recent">
        <div className="title">Most Recent</div>
        <div className="flows">{
          this.state.recent.map((flow: Flow, idx: number) => (<div key={idx}>{this.renderFlow(flow)}</div>))
        }</div>
      </div>
    </div>;
  }
}