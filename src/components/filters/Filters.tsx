import React from "react";
import "./Filters.scss";
import {renderIf} from "../../utils";
import {FilterCategory, ReportFilter} from "../../utils/types";
import CheckBox from "../checkbox/CheckBox";

interface FiltersProps {
  filters: ReportFilter[],
  onUpdateFilter?: (idx: number, filter: ReportFilter) => any,
  onDeleteFilter?: (idx: number) => any;
}

interface FiltersState {
}


export default class Filters extends React.Component<FiltersProps, FiltersState> {
  constructor(props: FiltersProps) {
    super(props);
    this.state = {};
  }

  private handleFilterChecked(filter: ReportFilter, filterIdx: number, categoryIdx: number) {
    if (!!this.props.onUpdateFilter) {
      if (categoryIdx === -1) {
        filter.showAllContacts = !filter.showAllContacts;
        filter.categories.forEach((category: FilterCategory) => {
          category.isFilter = false;
        });
      } else {
        filter.showAllContacts = false;
        filter.categories.forEach((category: FilterCategory, idx) => {
          category.isFilter = categoryIdx === idx ? !category.isFilter : category.isFilter;
        });
      }
      this.props.onUpdateFilter(filterIdx, filter);
    }
  }

  render() {
    if (this.props.filters.length === 0) return <></>;
    return <div className="filters-container">
      <div className="title">Filters</div>
      <div className="inner-scroll">
        {this.props.filters.map((filter: ReportFilter, idx) => (
          <div key={idx} className={"filter-item" + (filter.isActive ? "" : " inactive")}>
            <div className="filter-header">
              <i className="fa fa-filter icon pt-3" onClick={() => {
                if (!!this.props.onUpdateFilter) {
                  filter.isActive = !filter.isActive;
                  this.props.onUpdateFilter(idx, filter);
                }
              }}></i>
              <div className="filter-label">{filter.label}</div>
              <i className="fa fa-trash remove pt-3" onClick={() => {
                if (!!this.props.onDeleteFilter) this.props.onDeleteFilter(idx)
              }}></i>
            </div>

            {renderIf(filter.isActive)(
              <ul className="filter-categories">
                {renderIf(filter.isGroupFilter && filter.isActive)(<li>
                  <CheckBox checked={filter.showAllContacts} onChecked={() => {
                    this.handleFilterChecked(filter, idx, -1)
                  }} label={"All Contacts"}></CheckBox>
                </li>)}
                {filter.categories.map((category: FilterCategory, categoryIdx) => (<li key={categoryIdx}>
                  <CheckBox checked={category.isFilter} onChecked={() => {
                    this.handleFilterChecked(filter, idx, categoryIdx)
                  }} label={category.label}></CheckBox>
                </li>))}
              </ul>
            )}
          </div>))
        }
      </div>
    </div>;
  }
}