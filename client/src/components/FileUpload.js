import React, { Component } from "react";
import axios from "axios";

// This is a class level component file upload component
class FileUpload extends Component {
  delimeterInput = React.createRef();
  rowInput = React.createRef();
  state = {
    file: null,
    fileName: "",
    fileData: [],
    delimiter: ",",
    rowInput: 0,
    updatedDataArray: [],
  };

  // this method is to select the file from the system

  handleFile = (event) => {
    event.preventDefault();
    console.log(event.target.files + "test");
    console.log(event.target.files[0] + "test0");
    let file = event.target.files[0];
    this.setState({ file: file });
  };

  // setting the delimeter in the state from the delimeter input
  delimeterChange = (event) => {
    this.setState({ delimiter: this.delimeterInput.current.value });
    event.preventDefault();
  };

  // Setting the row in the state from the lines input 
  // and modifying the array on baisis of that input
  rowChange = (event) => {
    this.setState({
      updatedDataArray: this.state.fileData.toString().split("\n"),
      rowInput: event.target.value,
    });
    this.setState({ rowInput: event.target.value }, () => {
      const { rowInput, updatedDataArray } = this.state;
      if (rowInput && rowInput !== 0) {
        updatedDataArray.length = rowInput;
      }
      this.setState({});
    });

    event.preventDefault();
  };

  // On click of upload button passing all the data to axios and getting the response 
  // and set all the response in the state for further use
  handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", this.state.file);
    axios
      .post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        this.setState({
          fileData: response.data,
          rowInput: response.data.toString().split("\n").length,
          updatedDataArray: response.data.toString().split("\n"),
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  // displaying the table on basis of reponse
  getcontent = () => {
    const { updatedDataArray } = this.state;
    if (updatedDataArray.length > 0) {
      return this.renderTable();
    } else {
      return <div />
    }
  };

  // creating the layout of the output table
  renderTable = () => {
    return (
      <div>
        <label className="upload-container">
          Delimenter{" "}
          <input
            className="upload-container"
            type="text"
            name="Delimiter"
            value={this.state.delimiter}
            onChange={this.delimeterChange}
            ref={this.delimeterInput}
          ></input>
        </label>
        <label className="upload-container">
          Rows{" "}
          <input
            className="upload-container"
            type="text"
            value={this.state.rowInput}
            onChange={this.rowChange}
          />
        </label>
        <table className="table-container">
          <tbody className="table-container">{this.renderTableData()}</tbody>
        </table>{" "}
      </div>
    );
  }

  //Passing the data to the table and creating the dynamic table 
  renderTableData = () => {
    const { updatedDataArray } = this.state;
    return updatedDataArray.map((data, index) => {
      let updatedData = "";
      if (this.state.delimiter) {
        updatedData = data.split(this.state.delimiter);
      }

      if (!this.state.delimiter || updatedData[0] === data) {
        return (
          <tr className="table-container" key={index}>
            <td className="table-container">{data}</td>
          </tr>
        );
      }

      return (
        <tr className="table-container" key={index}>
          <td className="table-container">{updatedData[0]}</td>
          <td className="table-container">{updatedData[1]}</td>
          <td className="table-container">{updatedData[2]}</td>
          <td className="table-container">{updatedData[3]}</td>
        </tr>
      );
    }, this);
  };

  render() {
    console.log("IN Render");
    return (
      <div>
        <h1 className="main-container">File Uploader</h1>
        <div className="upload-container">
          <label className="upload-container">Select File</label>
          <input
            className="upload-container"
            type="file"
            name="file"
            onChange={this.handleFile}
          />
        </div>

        <button className="upload-button-container" onClick={this.handleUpload}>
          {" "}
          Upload{" "}
        </button>

        <h1 className="main-container">Output</h1>

        <div>{this.getcontent()}</div>
      </div>
    );
  }
}

export default FileUpload;
