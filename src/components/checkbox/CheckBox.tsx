import React from "react";
import "./CheckBox.scss";

interface CheckBoxProps {
  checked: boolean,
  onChecked: (checked: boolean) => any,
  label: string,
}
interface CheckBoxState {
  checked: boolean,
  label: string,
}


export default class CheckBox extends React.Component<CheckBoxProps, CheckBoxState>{
  constructor(props: CheckBoxProps) {
    super(props);
    this.state = {checked: this.props.checked, label: this.props.label};
  }

  componentWillReceiveProps(nextProps: CheckBoxProps) {
    this.setState({checked: nextProps.checked, label: nextProps.label});
  }

  private handleOnChecked() {
    let checked = !this.state.checked;
    this.setState({checked})
    this.props.onChecked(checked);
  }

  render() {
    return <div className={"checkbox-container"} onClick={this.handleOnChecked.bind(this)}>
      <i className={"far" + (this.state.checked ? " fa-check-square" : " fa-square")}/>
      <div className="label">{this.state.label}</div>
    </div>;
  }
}