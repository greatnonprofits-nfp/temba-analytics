import * as React from 'react';


export interface GearMenuItemProps {
  title: string,
  hidden?: boolean,
  onItemClicked: () => any,
}

interface GearMenuItemState {
}

export default class GearMenuItem extends React.Component<GearMenuItemProps, GearMenuItemState> {
  constructor(props: GearMenuItemProps) {
    super(props);
    this.state = {};
  }

  public render(): JSX.Element {
    return <div className={"gear-menu-item"} onClick={this.props.onItemClicked}>{this.props.title}</div>;
  }
}