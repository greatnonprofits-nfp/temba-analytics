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

  private handleFilterChecked(filter: ReportFilter, filterIdx: number, categoryIdx: number, checked: boolean|null) {
    if (!!this.props.onUpdateFilter) {
      if (categoryIdx === -1) {
        filter.showAllContacts = !filter.showAllContacts;
        filter.categories.forEach((category: FilterCategory) => {
          category.isFilter = null;
        });
      } else {
        filter.showAllContacts = false;
        filter.categories.forEach((category: FilterCategory, idx) => {
          category.isFilter = categoryIdx === idx ? checked : category.isFilter;
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
              }}/>
              <div className="filter-label">{filter.label}</div>
              <i className="fa fa-trash remove pt-3" onClick={() => {
                if (!!this.props.onDeleteFilter) this.props.onDeleteFilter(idx)
              }}/>
            </div>

            {renderIf(filter.isActive)(
              <ul className="filter-categories">
                {renderIf(filter.isGroupFilter && filter.isActive)(<li>
                  <CheckBox checked={filter.showAllContacts} onChecked={(checked) => {
                    this.handleFilterChecked(filter, idx, -1, checked)
                  }} label={"All Contacts"}/>
                </li>)}
                {filter.categories.map((category: FilterCategory, categoryIdx) => (<li key={categoryIdx}>
                  <CheckBox
                    label={category.label}
                    indeterminate={true}
                    checked={category.isFilter}
                    onChecked={(checked) => {
                      this.handleFilterChecked(filter, idx, categoryIdx, checked)
                    }}
                  />
                </li>))}
              </ul>
            )}
          </div>))
        }
      </div>
    </div>;
  }
}