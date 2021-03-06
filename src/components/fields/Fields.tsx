import React from "react";
import {renderIf} from "../../utils";
import "./Fields.scss"
import CheckBox from "../checkbox/CheckBox";
import {Field, FilterCategory, ReportFilter, ReportSegment, SegmentCategory} from "../../utils/types";
import Controls from "../controls/Controls";
import mutate from "immutability-helper";
import Highcharts from "highcharts";

interface FieldsProps {
  fields: Field[],
  onFieldRemoved?: (field: Field) => any,
  onFieldUpdated?: (field: Field) => any,
  onSegmentCreated?: (segment: ReportSegment) => any,
  onFilterCreated?: (filter: ReportFilter) => any,
}

interface FieldsState {
  fields: Field[],
}


export default class Fields extends React.Component<FieldsProps, FieldsState> {
  constructor(props: FieldsProps) {
    super(props);
    this.state = {fields: this.props.fields};
  }

  componentWillReceiveProps(nextProps: FieldsProps) {
    this.setState({fields: nextProps.fields});
  }

  private handleFieldRemoved(idx: number, field: Field) {
    let fields: any = mutate(this.state.fields, {$splice: [[idx, 1]]});
    this.setState({fields});
    if (!!this.props.onFieldRemoved) this.props.onFieldRemoved(field);
  }

  private handleFieldUpdated(idx: number, field: Field, checked: boolean) {
    field.isVisible = checked;
    let fields: any = mutate(this.state.fields, {[idx]: {$set: field}});
    this.setState({fields});
    if (!!this.props.onFieldUpdated) this.props.onFieldUpdated(field);
  }

  private handleOnSegmentClicked(field: Field) {
    if (!!this.props.onSegmentCreated) {
      let colors: any = Highcharts.getOptions().colors;
      let categories: SegmentCategory[] = [];
      if (!!field.categories && field.categories.length > 0) {
        let _categories = field.categories[0].categories ?? field.categories;
        categories = _categories.map((category: any) => {
          return {
            label: category.label,
            isSegment: true,
            color: colors[((field.categories || []).length) % colors.length],
          }
        });
      }
      this.props.onSegmentCreated({
        fieldId: field.id,
        isSegment: true,
        isGroupSegment: false,
        label: field.label,
        categories: categories,
      });
    }
  }

  private handleOnFilterClicked(field: Field) {
    if (!!this.props.onFilterCreated) {
      let categories: FilterCategory[] = [];
      if (!!field.categories && field.categories.length > 0) {
        let _categories = field.categories[0].categories ?? field.categories;
        categories = _categories.map((category: any) => {
          return {
            label: category.label,
            contacts: category.contacts,
            isFilter: true,
          }
        });
      }
      this.props.onFilterCreated({
        fieldId: field.id,
        isActive: true,
        label: field.label,
        isGroupFilter: false,
        showAllContacts: false,
        categories: categories,
      });
    }
  }

  render() {
    return <div className="fields-container">
      {renderIf(this.state.fields.length > 0)(
        <>
          <div className="title">Charts</div>
          <div className="inner-scroll">
            {this.state.fields.map((field: Field, idx) => (
              <div
                key={idx}
                className={"field-item" + (field.isVisible ? "" : " inactive")}
              >
                <CheckBox
                  label={field.label}
                  checked={field.isVisible}
                  onChecked={(checked) => {
                    // @ts-ignore
                    this.handleFieldUpdated(idx, field, checked)
                  }}/>
                <Controls
                  onSegmentClicked={() => {
                    this.handleOnSegmentClicked(field)
                  }}
                  onFilterClicked={() => {
                    this.handleOnFilterClicked(field)
                  }}
                  onRemoveClicked={() => {
                    this.handleFieldRemoved(idx, field)
                  }}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>;
  }
}