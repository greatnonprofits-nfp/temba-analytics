import React from "react";

interface ChartProps {}
interface ChartState {}


export default class Chart extends React.Component<ChartProps, ChartState>{
  constructor(props: ChartProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <>This is a Chart</>;
  }
}