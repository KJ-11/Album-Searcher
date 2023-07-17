import "./HomePage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Particles from "react-tsparticles";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
} from "react-bootstrap";
import { useState, useEffect } from "react";

const CLIENT_ID = "";
const CLIENT_SECRET = "";

function HomePage() {
  const [accessToken, setAccessToken] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    //API Access Token
    var authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  // SEARCH
  async function search() {
    console.log("Searching for search input: " + searchInput);

    // Get request using search to get Artist ID
    var searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    var artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        return data.artists.items[0].id;
      });

    console.log("Artist ID is " + artistID);

    // Get request with Artist ID to grab all albums from artist
    var returnedAlbums = await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        "/albums" +
        "?include_groups=album&market=US&limit=50",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAlbums(data.items);
      });

    // Display them to user
    console.log(albums);
  }

  return (
    <div className="HomePage">
      <div className="Search-Bar">
        <Container className="">
          <InputGroup className="mb-3" size="lg">
            <FormControl
              placeholder="Search for Artist"
              type="Input"
              onKeyDown={(event) => {
                if (event.key == "Enter") {
                  search();
                }
              }}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <Button onClick={search} variant="dark">
              Search
            </Button>
          </InputGroup>
        </Container>
      </div>
      <Container>
        <Row className="mx-4 row row-cols-3">
          {albums.map((album, i) => {
            return (
              <Card className="mb-4 p-0 rounded-5">
                <Card.Img src={album.images[0].url} className="rounded-top-5" />
                <Card.Body>
                  <a href={album.external_urls.spotify} target="_blank">
                    <Card.Title>{album.name}</Card.Title>
                  </a>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}

export default HomePage;
