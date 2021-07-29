import React from "react";
import {renderIf} from "../../utils";
import "./Fields.scss"

interface FieldsProps {
  fields: any[],
}

interface FieldsState {
  fields: any[],
}


export default class Fields extends React.Component<FieldsProps, FieldsState> {
  constructor(props: FieldsProps) {
    super(props);
    this.state = {fields: this.props.fields};
  }

  componentWillReceiveProps(nextProps: FieldsProps) {
    this.setState({fields: nextProps.fields});
  }

  render() {
    return <div className="fields-container">
      {renderIf(this.state.fields.length > 0)(
        <>
          <div className="title">Charts</div>
          <div className="inner-scroll">
            {this.state.fields.map((field: any, idx) => (
              <div
                key={idx}
                className={"field-item"}
              >
                <div className="name">
                  {field.label}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>;
  }
}