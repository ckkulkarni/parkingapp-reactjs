import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { initializeParkingLot } from "./redux/reducer/parkingSlice";
interface State {
  spaces: number | "";
  numberChosen: boolean;
}

interface Props {
  numSpaces: number;
  initializeParkingLot: (numSpaces: number) => void;
}

class Base extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      spaces: "",
      numberChosen: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: any) {
    this.setState({ spaces: event.target.value });
  }

  handleSubmit(event: any) {
    event.preventDefault();
    alert(this.state.spaces + " Spaces selected");
    this.props.initializeParkingLot(Number(this.state.spaces));
    this.setState({ numberChosen: true });
  }

  render() {
    return (
      <div className="inputContainer">
        <form onSubmit={this.handleSubmit} className="baseForm">
          <input
            type="number"
            name="spaces"
            placeholder="Enter the Spaces"
            onChange={this.handleChange}
            className="form-control form-control-lg"
            data-testid="input"
          />
          <br />
          <button
            type="submit"
            id="baseButton"
            disabled={this.state.spaces <= 0}
          >
            Submit
          </button>

          <div>
            <Link to="/spaces">
              <button id="baseButton" disabled={!this.state.numberChosen}>
                Start App
              </button>
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  numSpaces: state?.parking?.numSpaces || 0,
});

const mapDispatchToProps = {
  initializeParkingLot,
};

export default connect(mapStateToProps, mapDispatchToProps)(Base);
