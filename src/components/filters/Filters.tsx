import React from "react";

interface FiltersProps {}
interface FiltersState {}


export default class Filters extends React.Component<FiltersProps, FiltersState>{
  constructor(props: FiltersProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <>This is a filters</>;
  }
}