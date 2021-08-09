import React from "react";
import Select from "react-select";
import {Flow} from "../../utils/types";


interface FieldSelectorProps {
  flows: Flow[],
  fields: any[],
  onFieldsSelected: (fields: any[]) => any;
}

interface FieldSelectorState {
  allFields: any[],
  open: boolean,
}

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
};

const groupBadgeStyles = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 400,
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
};

export default class FieldSelector extends React.Component<FieldSelectorProps, FieldSelectorState> {
  private selectComponent: any;

  constructor(props: FieldSelectorProps) {
    super(props);
    let allFields = this.prepareFields(this.props);
    this.state = {allFields, open: false};
  }

  componentWillReceiveProps(nextProps: FieldSelectorProps) {
    let allFields = this.prepareFields(nextProps);
    this.setState({allFields, open: false});
  }

  private prepareFields(props: FieldSelectorProps) {
    return props.flows.map(flow => {
      return {
        label: flow.text,
        options: flow.rules.filter((rule) => {
          return !props.fields.find((field: { id: { flow: any, rule: any } }) =>
            field.id.flow === flow.id && field.id.rule === rule.id
          )
        }).map((rule) => {
          return {label: rule.text, value: {flow: flow.id, rule: rule.id}}
        })
      }
    })
  }

  private onGroupSelected(options: any) {
    this.props.onFieldsSelected(options);
    this.selectComponent.setState({menuIsOpen: false})
  }

  private onOptionSelected(option: any) {
    this.props.onFieldsSelected([option])
    setTimeout(() => this.selectComponent.setState({value: null}), 100)
  }

  private formatGroupLabel(data: any) {
    return (
      <div style={groupStyles} onClick={() => {
        this.onGroupSelected(data.options)
      }}>
        <span>{data.label}</span>
        <span style={groupBadgeStyles}>{data.options.length}</span>
      </div>
    );
  }

  render() {
    return <Select
      ref={(el: any) => {
        this.selectComponent = el
      }}
      searchable={true}
      placeholder={"Add a field"}
      styles={{
        option: (provided: any) => ({
          ...provided,
          fontSize: "14px",
          padding: "5px 10px 5px 20px",
          borderRadius: "4px",
          margin: "3px 5px 0 0",
          cursor: "pointer",
          color: "var(--color-text-dark)",
          backgroundColor: "white",
          "&:hover": {
            backgroundColor: "rgba(var(--focus-rgb), 0.2)"
          }
        }),
        menuList: (provided: any) => ({
          ...provided,
          padding: '4px'
        })
      }}
      options={this.state.allFields}
      formatGroupLabel={this.formatGroupLabel.bind(this)}
      onChange={this.onOptionSelected.bind(this)}
    />;
  }
}