import React from "react";

import { Button, Spinner } from "react-bootstrap";
//import "bootstrap/dist/css/bootstrap.min.css";
import "./Spinner.css";
class LoadingIndicator extends React.Component {
  render() {
    return (
      <div className="spintarget">
        <>
          <Spinner animation="border" variant="light" />
        </>
      </div>
    );
  }
}

export default LoadingIndicator;
