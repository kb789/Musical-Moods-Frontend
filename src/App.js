import React from "react";

import "./App.css";

import music from "./music.jpg";

import vunhappy from "./vunhappy.png";
import unhappy from "./unhappy.png";
import fair from "./fair.png";
import happy from "./happy.png";
import vhappy from "./vhappy.png";

function shortenText(text) {
  let shortText = "";
  if (text != null && text.length > 25) {
    shortText = text.slice(0, 25) + "..";
    return shortText;
  }
  return text;
}

function Header(props) {
  return (
    <div class="header">
      <h1>Musical Moods </h1>
    </div>
  );
}

function Results(props) {
  let album = props.album;
  let message = props.message;
  let valence = props.valence;
  let waiting = props.waiting;

  let mood;

  if (valence <= 0.2) {
    mood = vunhappy;
  } else if (valence > 0.2 && valence < 0.45) {
    mood = unhappy;
  } else if (valence >= 0.45 && valence < 0.65) {
    mood = fair;
  } else if (valence >= 0.65 && valence < 0.75) {
    mood = happy;
  } else if (valence >= 0.75 && valence <= 1) {
    mood = vhappy;
  }

  let text;
  if (message === "unprocessable") {
    text = "Song not found. Please try again.";
  } else {
    text = "";
  }

  const image = props.image;
  album = shortenText(album);

  if (waiting === true) {
    console.log("waiting:" + waiting);
    return <div class="loader"></div>;
  }

  if (valence) {
    return (
      <div>
        <div className="image-container">
          <div className="card">
            <img
              className="card-image-bottom"
              src={image}
              width="109"
              height="109"
              alt="card"
            />
            <div className="card-body">
              <span className="card-text">{album}</span>
              <br />
              <br />
              <img src={mood} alt="card" className="card-image-top" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="image-container">
      <div>
        <p>{text}</p>
      </div>
      <div className="card">
        <img src={music} alt="card" className="card-image-top" />
        <div className="card-body">
          <p className="card-title">Discover the mood of your favorite song.</p>
        </div>
      </div>
    </div>
  );
}

class MusicApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      songname: null,
      artist: null,
      valence: null,
      album: null,
      image: null,
      message: null,
      waiting: null,
    };

    this.myChangeHandler = (event) => {
      this.setState({ songname: event.target.value });
    };

    this.myChangeHandler2 = (event) => {
      this.setState({ artist: event.target.value });
    };

    this.mySubmitHandler = (event) => {
      event.preventDefault();
      this.setState({ waiting: true });

      const data = { songname: this.state.songname, artist: this.state.artist };
      fetch("https://music-moods.onrender.com/searchSong", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          this.setState({
            valence: data.valence,
            album: data.album,
            image: data.image,
            message: data.message,
            waiting: false,
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
  }
  render() {
    return (
      <div className="container">
        <div className="header">
          <Header />
        </div>

        <form onSubmit={this.mySubmitHandler}>
          <div className="form-group">
            <label for="songname">Song title:</label>
            <input type="text" onChange={this.myChangeHandler} />
          </div>

          <div class="form-group">
            <label for="artist">Artist name:</label>
            <input type="text" onChange={this.myChangeHandler2} />
          </div>

          <button type="submit">search</button>
        </form>

        <div className="results">
          <Results
            artist={this.state.artist}
            songname={this.state.songname}
            valence={this.state.valence}
            album={this.state.album}
            image={this.state.image}
            message={this.state.message}
            waiting={this.state.waiting}
          />
        </div>
      </div>
    );
  }
}
export default MusicApp;
