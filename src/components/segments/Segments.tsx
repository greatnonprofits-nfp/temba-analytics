import React from "react";
import {ReportSegment} from "../../utils/types";

interface SegmentsProps {
  segments: ReportSegment[],
}
interface SegmentsState {}


export default class Segments extends React.Component<SegmentsProps, SegmentsState>{
  constructor(props: SegmentsProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <></>;
  }
}