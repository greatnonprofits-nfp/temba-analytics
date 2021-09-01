import React from "react";
import "./CheckBox.scss";

interface CheckBoxProps {
  checked: boolean | null,
  onChecked: (checked: boolean | null) => any,
  indeterminate?: boolean,
  label: string,
}

interface CheckBoxState {
  checked: boolean | null,
  label: string,
}


export default class CheckBox extends React.Component<CheckBoxProps, CheckBoxState> {
  constructor(props: CheckBoxProps) {
    super(props);
    this.state = {checked: this.props.checked, label: this.props.label};
  }

  componentWillReceiveProps(nextProps: CheckBoxProps) {
    this.setState({checked: nextProps.checked, label: nextProps.label});
  }

  private handleOnChecked() {
    let checked: boolean | null = true;
    if (this.props.indeterminate) {
      if (this.state.checked === true) {
        checked = false;
      } else if (this.state.checked === false) {
        checked = null;
      }
    } else {
      checked = !this.state.checked;
    }
    this.setState({checked})
    this.props.onChecked(checked);
  }

  private getCurrentStateIcon() {
    if (this.props.indeterminate) {
      if (this.state.checked === true) {
        return "fa-check-square";
      } else if (this.state.checked === false) {
        return "fa-minus-square"
      } else {
        return "fa-square"
      }
    } else {
      return this.state.checked ? "fa-check-square" : "fa-square";
    }
  }

  render() {
    return <div className={"checkbox-container"} onClick={this.handleOnChecked.bind(this)}>
      <i className={"far " + this.getCurrentStateIcon()}/>
      <div className="checkbox-label">{this.state.label}</div>
    </div>;
  }
}