import React from "react";
import Select from "react-select";


interface FilterProps {
}

interface FilterState {
  filters: any[];
}

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
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

const formatGroupLabel = (data: any) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

const testOptions = [
  {
    label: "Flow 1", options: [
      {label: "Result 1", value: "result_1"},
      {label: "Result 2", value: "result_2"},
    ]
  },
  {
    label: "Flow 2", options: [
      {label: "Result 1", value: "result_1"}
    ]
  }
]


export default class FieldSelector extends React.Component<FilterProps, FilterState> {
  constructor(props: FilterProps) {
    super(props);
    this.state = {filters: []};
  }

  render() {
    return <Select
      searchable={true}
      placeholder={"Add a field"}
      styles={{
        option: (provided: any) => ({
          ...provided,
          fontSize: "14px",
          padding: "5px 10px",
          borderRadius: "4px",
          margin: "3px",
          cursor: "pointer",
          color: "var(--color-text-dark)",
          backgroundColor: "white",
          "&:hover": {
            backgroundColor: "rgba(var(--focus-rgb), 0.2)"
          }
        }),
        menuList: (provided: any) => ({
          ...provided,
          padding: '2px'
        })
      }}
      options={testOptions}
      formatGroupLabel={formatGroupLabel}
    />;
  }
}