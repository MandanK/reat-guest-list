import './App.css';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

let noGuestMessage = 'No guest found! Please add guests to your lists!';
let title = 'GUEST LIST';

const inputTextFieldStyle = css`
  border-style: line;
  border-color: black;
  background-color: rgba(216, 191, 216);
  height: 30px;
  width: 600px;
  margin-bottom: 10px;
`;

const listItemStyle = css`
  list-style: none;
  display: flex;
  // flex-wrap: nowrap;
  justify-content: space-between;
  white-space: pre-wrap;
`;

const notComingGuestStyle = css`
  font-family: sans-serif;
  font-size: 20px;
  font-weight: 400%;
  color: #ff1493;
  font-weight: bold;
`;

const ComingGuestStyle = css`
  font-family: sans-serif;
  font-size: 20px;
  font-weight: 400%;
  color: #7b68ee;
  font-weight: bold;
`;

const guestItemStyle = css`
  display: flex;
  min-width: 430px;
`;

const addGuestButtonStyle = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(186, 85, 211);
  border: none;
  transition: background-color 0.3s ease-in 0s;
  color: black;
  font-weight: 600;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  padding: 8px 12px;
  height: 36px;
  width: 200px;
  font-size: 1rem;
  letter-spacing: 0.018rem;
  line-height: 1.269rem;
  :hover {
    background-color: rgb(250, 130, 167);
  }
  margin-top: 10px;
`;

const inputWrapperStyle = css`
  position: absolute;
  left: 400px;
`;

const guestListStyle = css`
  border-color: black;
  border-radius: 0.5px;
  border-width: 0.5px;
  border-style: dotted;
  width: 700px;
  position: absolute;
  top: 250px;
  left: 400px;
`;

const removeIconStyle = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(255, 105, 180);
  border: none;
  transition: background-color 0.3s ease-in 0s;
  color: rgb(255, 255, 255);
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  padding: 4px 6px;
  width: 90px;
  height: 40px;
  font-size: 1.2rem;
  letter-spacing: 0.018rem;
  line-height: 1.269rem;
  // opacity: 0.2;
  margin-left: 10px;
  margin-top: auto;
  margin-bottom: auto;
  :hover {
    background-color: rgb(225, 121, 121);
  }
`;

const attendanceStatusCheckBoxStyle = css`
  margin-top: auto;
  margin-bottom: auto;
  width: 40px;
  height: 40px;
`;

const baseUrl = 'https://ul-express-rest-guest-list-api.herokuapp.com';

// List item of each guest
function ShowGuestInfoInList(guestAttributes) {
  const [attendanceStatus, setAttendanceStatus] = useState(
    guestAttributes.attending,
  );

  async function reverseAttendanceStatus(guestID) {
    const response = await fetch(`${baseUrl}/guests/${guestID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: !attendanceStatus }),
    });
    const updatedGuestStatus = await response.json();
    console.log(updatedGuestStatus);
    setAttendanceStatus(!attendanceStatus);
  }

  return (
    <li
      data-test-id="guest" // UpLeveled
      key={guestAttributes.firstName}
      css={listItemStyle}
    >
      <input
        aria-label="attending" // UpLeveled
        type="checkbox"
        checked={attendanceStatus}
        css={attendanceStatusCheckBoxStyle}
        onChange={() => {
          reverseAttendanceStatus(guestAttributes.id).catch((error) => {
            console.error('Error:', error);
          });
        }}
      />
      {attendanceStatus ? (
        <p css={ComingGuestStyle}>
          {' ' + guestAttributes.firstName} {guestAttributes.lastName} is a
          party 🐧!
        </p>
      ) : (
        <p css={notComingGuestStyle}>
          {' ' + guestAttributes.firstName} {guestAttributes.lastName} is a lazy
          fluffy 🐼!
        </p>
      )}
    </li>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [remove, setRemove] = useState(false);
  const [guestsList, setGuestsList] = useState([]);
  const [guestFirstName, setGuestFirstName] = useState('');
  const [guestLastName, setGuestLastName] = useState('');

  // Add a Guest
  async function addGuest(enteredFirstName, enteredLastName) {
    function deleteEnteredNames() {
      setGuestFirstName('');
      setGuestLastName('');
    }

    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: enteredFirstName,
        lastName: enteredLastName,
      }),
    });
    const createdGuest = await response.json();
    console.log(createdGuest);
    deleteEnteredNames();
  }

  // Performing remove a single guest
  async function performRemove(guestID) {
    const response = await fetch(`${baseUrl}/guests/${guestID}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    console.log(deletedGuest);
    setRemove(!remove);
  }

  // fetching all guests from server
  useEffect(() => {
    async function fetchAllGuests() {
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();
      console.log(allGuests);
      setGuestsList(allGuests);
      setLoading(false);
    }
    fetchAllGuests().catch((error) => {
      console.error('Error:', error);
    });
  }, [guestLastName, remove]);

  const disabled = loading ? true : false;

  return (
    <div className="APPWrapper">
      <h1> {title} </h1>

      <div css={inputWrapperStyle}>
        <label>
          First name:{' '}
          <input
            css={inputTextFieldStyle}
            value={guestFirstName}
            onChange={(event) => {
              setGuestFirstName(event.currentTarget.value);
            }}
            disabled={disabled}
          />
        </label>
        <br />
        <label>
          Last name:{' '}
          <input
            css={inputTextFieldStyle}
            value={guestLastName}
            onChange={(event) => {
              setGuestLastName(event.currentTarget.value);
            }}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                addGuest(guestFirstName, guestLastName).catch((error) => {
                  console.error('Error:', error);
                });
              }
            }}
            disabled={disabled}
          />
        </label>
        <br />
        <button
          css={addGuestButtonStyle}
          onClick={() => {
            addGuest(guestFirstName, guestLastName).catch((error) => {
              console.error('Error:', error);
            });
          }}
        >
          ADD GUEST
        </button>
      </div>
      <div css={guestListStyle}>
        {/* in case loading takes a while... this shows a loading message*/}
        {loading === true ? (
          <p>Loading...</p>
        ) : (
          <div>
            <ul>
              {guestsList.length === 0 && <p>{noGuestMessage}</p>}
              {guestsList.map((event) => {
                return (
                  <div css={guestItemStyle} key={event.id + event.firstName}>
                    <button
                      css={removeIconStyle}
                      onClick={() => {
                        performRemove(event.id).catch((error) => {
                          console.error('Error:', error);
                        });
                      }}
                    >
                      Remove
                    </button>
                    {'   '}
                    <ShowGuestInfoInList
                      key={event.id + event.firstName + event.lastName}
                      firstName={event.firstName}
                      lastName={event.lastName}
                      attending={event.attending}
                      id={event.id}
                    />
                  </div>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
