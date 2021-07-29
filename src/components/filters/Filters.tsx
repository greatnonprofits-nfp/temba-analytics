import React from "react";
import "./Filters.scss";
import {renderIf} from "../../utils";

interface FiltersProps {
  filters: any[]
}
interface FiltersState {}


export default class Filters extends React.Component<FiltersProps, FiltersState>{
  constructor(props: FiltersProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className="filters-container">
      {this.props.filters.map((filter: any, idx) => <div key={idx} className="filter">
        <div className="icon"></div>
        <div className="filter-label"></div>
        <div className="remove-filter"></div>

        <ul className="filter-categories">
          {renderIf(filter.isGroupFilter && filter.isActive)(<li><temba-checkbox>All Contacts</temba-checkbox></li>)}
          {}
        </ul>
      </div>)}
    </div>;
  }
}