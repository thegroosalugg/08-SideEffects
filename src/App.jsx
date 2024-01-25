import { useRef, useState, useEffect } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

function App() {
  const modal = useRef();
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState([]);
  const [availablePlaces, setAvailablePlaces] = useState([]);

  // useEffect takes 2 arguments, an empty arrow function with the code we want to run...
  //... and a dependency array that will only re-execute the function if the dependency values change
  useEffect(() => {
    // this function is a side effect as it does not carry out the main purpose of the component, to return renderable JSX code
    // additionally  it may not execute its function when the app renders, but at another interval
    navigator.geolocation.getCurrentPosition((position) => {
      //  navigator geolocation function is part of the Geolocation API
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude, // position is an object with the coords & lat/long key values
        position.coords.longitude
      );

      setAvailablePlaces(sortedPlaces); // without useEffect, this code would cause an infinite loop as the location is fecthed each time the state is set
    });
  }, []); // Empty dependency array ensures that the effect runs only once on mount

  function handleStartRemovePlace(id) {
    modal.current.open();
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    modal.current.close();
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    // Get data from localStorage with the key "selectedPlaces".
    // JSON parse is the opposite of stringify, which will convert the string back to an array
    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || []; // If the data doesn't exist, default to an empty array.
    // Check if the current 'id' is not already present in the stored data.
    if (storedIds.indexOf(id) === -1) {
      // If 'id' is not in the stored data, add it to the array.
      // The array is then converted back to a string and stored in localStorage.
      localStorage.setItem( // setItem take a key value pair as arguments, both must be in string format
        "selectedPlaces",
        JSON.stringify([id, ...storedIds]) // JSON is a build-in browser component which converts datatypes to string
      );
    }
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    modal.current.close();
  }

  return (
    <>
      <Modal ref={modal}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Awaiting Location..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
