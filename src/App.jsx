import { useRef, useState, useEffect, useCallback } from "react";
import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

// local storage ID fetch only needs to run once when we run the app and does not need re-execution with every state change
const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || []; // fetch stored IDs (if any) or initialize with empty array
const storedPlaces = storedIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
  const selectedPlace = useRef();
  const [modalOpen, setModalOpen] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces); // state initialised with stored IDs (if any) or an empty array

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
    setModalOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalOpen(false);
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
      localStorage.setItem(
        // setItem take a key value pair as arguments, both must be in string format
        "selectedPlaces",
        JSON.stringify([id, ...storedIds]) // JSON is a build-in browser component which converts datatypes to string
      );
    }
  }

  const handleRemovePlace = useCallback(function handleRemovePlace() { // useCallback prevents the function from being executed each time App is rendered
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalOpen(false)

    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
    ); // if the ID does not match of the selected place ref, filter returns true and we keep the item, if they match it returns false and deletes it
  }, []); // list of dependencies that would cause this function to reexecute. In this case none, so it will not run each time app is rendered

  return (
    // onClose prop is required to change state if modal is closed with ESC key
    <>
      <Modal open={modalOpen} onClose={handleStopRemovePlace}>
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
