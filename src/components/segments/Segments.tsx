import React from "react";

interface SegmentsProps {}
interface SegmentsState {}


export default class Segments extends React.Component<SegmentsProps, SegmentsState>{
  constructor(props: SegmentsProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <>This is a segments</>;
  }
}