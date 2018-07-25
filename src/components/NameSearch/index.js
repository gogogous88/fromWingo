import React, { Component } from "react";
import logo from "../../logo.svg";
import axios from "axios";
import { RingLoader } from "react-spinners";
import _ from "lodash";
import "./styles.css";
import "../../App.css";

export class NameSearch extends Component {
  state = { nameList: [], loading: false, value: "", showResult: false };
  componentDidMount = () => {};

  onSubmit = async e => {
    e.preventDefault();
    this.setState({ loading: true, showResult: true });
    const nameList = await axios
      .get(`https://itunes.apple.com/search?term=${this.state.value}`)
      .catch(e => alert(e));

    const { data } = nameList;

    let albumList = [];
    data.results.forEach(album => {
      var existing = albumList.filter(function(v, i) {
        return v.collectionName == album.collectionName;
      });
      if (existing.length) {
        var existingIndex = albumList.indexOf(existing[0]);
        albumList[existingIndex].trackName = albumList[
          existingIndex
        ].trackName.concat(album.trackName);
      } else {
        if (typeof album.trackViewUrl == "string")
          album.trackName = [album.trackName];
        albumList = [...albumList, album];
      }
    });

    await this.setState({ nameList: albumList });
    console.log(this.state.nameList);
    setTimeout(() => {
      this.setState({ loading: false });
    }, 1500);
  };

  renderSongs = songs => {
    if (songs) {
      if (songs.length > 4) {
        songs = songs.splice(0, 4);
      }
      return songs.map(song => (
        <li style={{ fontSize: 12, marginLeft: 10, margin: 3 }} key={song}>
          {song}
        </li>
      ));
    }
    return <p>no songs in this album</p>;
  };

  renderNameList = () => {
    const { nameList } = this.state;
    return nameList.map(each => {
      return (
        <div class="rowContainer" key={each.trackId}>
          <div style={{ flex: 1.5 }}>
            <img
              src={each.artworkUrl100}
              style={{ width: "100%", height: "auto", alignSelf: "center" }}
            />
          </div>
          <div style={{ flex: 3, marginLeft: 25 }}>
            <h4>{each.collectionName}</h4>
            <div style={{ marginTop: 10 }}>
              {this.renderSongs(each.trackName)}
            </div>
          </div>
        </div>
      );
    });
  };

  renderResult = () => {
    if (this.state.loading) {
      return (
        <div className="loading">
          <RingLoader color={"#4343e5ba"} loading={this.state.loading} />
        </div>
      );
    }
    return (
      <div>
        {!_.isEmpty(this.state.nameList) ? (
          <div className="wrapper">{this.renderNameList()}</div>
        ) : (
          this.state.showResult && (
            <p>sorry, {this.state.value},no songs has been found</p>
          )
        )}
      </div>
    );
  };

  render() {
    return (
      <div>
        <div className="searchContainer">
          <form
            onSubmit={e => {
              if (this.state.value) {
                return this.onSubmit(e);
              }
              alert("please input a name first");
            }}
          >
            <input
              className="input"
              value={this.state.value}
              placeholder="please input a singer here"
              onChange={e =>
                this.setState({ value: e.target.value, showResult: false })
              }
            />

            <button className="searchButton" type="submit">
              Search
            </button>
          </form>
        </div>
        <div className="resultContainerstyle">{this.renderResult()}</div>
      </div>
    );
  }
}

export default NameSearch;
