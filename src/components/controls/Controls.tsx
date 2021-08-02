import React from "react";
import {renderIf} from "../../utils";
import "./Controls.scss"

interface ControlsProps {
  className?: string,
  onSegmentClicked?: () => any,
  onFilterClicked?: () => any,
  onRemoveClicked?: () => any,
}
interface ControlsState {}


export default class Controls extends React.Component<ControlsProps, ControlsState>{
  constructor(props: ControlsProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className={"controls-container" + (this.props.className ? ` ${this.props.className}`: "")}>
      {renderIf(!!this.props.onSegmentClicked)(<i className={"fab fa-buffer"} onClick={this.props.onSegmentClicked}/>)}
      {renderIf(!!this.props.onFilterClicked)(<i className={"fa fa-filter"} onClick={this.props.onFilterClicked}/>)}
      {renderIf(!!this.props.onRemoveClicked)(<i className={"fa fa-trash"} onClick={this.props.onRemoveClicked}/>)}
    </div>;
  }
}