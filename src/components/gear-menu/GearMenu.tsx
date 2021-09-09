import React, {createRef} from 'react';
import {renderIf} from "../../utils";
import "./GearMenu.scss"

export interface GearMenuProps {
}

interface GearMenuState {
  itemsVisible: boolean
}

export default class GearMenu extends React.Component<GearMenuProps, GearMenuState> {
  buttonRef: any;

  constructor(props: GearMenuProps) {
    super(props);
    this.state = {
      itemsVisible: false
    };
    this.buttonRef = createRef();
  }

  componentDidMount() {
    document.addEventListener("click", this.handleDocumentClick.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleDocumentClick.bind(this));
  }

  private handleDocumentClick(evt: any) {
    if (!!this.buttonRef.current) {
      if (this.state.itemsVisible && evt.target !== this.buttonRef.current && evt.target !== this.buttonRef.current.firstChild) {
        this.setState({itemsVisible: false});
      }
    }
  }

  private renderMenuItems() {
    return React.Children.map(this.props.children, (child: any, idx) => !child.props.hidden ? child : <></>);
  }

  public render(): JSX.Element {
    return <div className={"gear-menu-container"}>
      <div
        ref={this.buttonRef}
        className={`gear-menu-button ${this.state.itemsVisible ? "clicked" : ""}`}
        onClick={() => {
          this.setState({itemsVisible: !this.state.itemsVisible})
        }}
      >
        <i className={"fas fa-bars"}/>
      </div>
      {renderIf(this.state.itemsVisible)(
        <div className={"gear-menu-list"}>
          {this.renderMenuItems()}
        </div>
      )}
    </div>;
  }
}
