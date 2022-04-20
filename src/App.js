import './App.css';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

let noGuestMessage = 'No guest found! Please add guests to your lists!';
let title = 'GUEST LIST';

const wrapperStyle = css`
  text-align: left;
  margin-left: 380px;
  margin-top: 150px;
`;

const image = css`
  width: 600px;
  float: right;
  margin-right: 150px;
  margin-top: -110px;
`;
const inputTextFieldStyle = css`
  border-style: line;
  border-width: 1px;
  border-color: black;
  background-color: #ade0ee;
  height: 30px;
  width: 400px;
  margin-top: 25px;
  margin-bottom: 0px;
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
  font-size: 17px;
  font-weight: 400%;
  color: #ff1493;
  font-weight: bold;
`;

const comingGuestStyle = css`
  font-family: sans-serif;
  font-size: 17px;
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
  background-color: #ffb6c1;
  border-width: 1px;
  border-color: black;
  font-weight: 600;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  padding: 8px 12px;
  height: 36px;
  width: 150px;
  font-size: 14px;
  margin-left: 215px;
  :hover {
    background-color: rgb(250, 130, 167);
  }
  margin-top: 40px;
`;

const inputWrapperStyle = css`
  position: absolute;
  left: 400px;
  font-weight: bold;
  margin-left: -210px;
`;

const guestListStyle = css`
  border: none;
  margin-top: 100px;
  position: absolute;
  top: 320px;
  left: 442px;
`;

const removeIconStyle = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #fd6c9e;
  border: none;
  transition: background-color 0.3s ease-in 0s;
  color: rgb(255, 255, 255);
  font-weight: 600;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  padding: 4px 6px;
  width: 70px;
  height: 30px;
  font-size: 14px;
  margin-left: -200px;
  margin-top: auto;
  margin-bottom: auto;
  :hover {
    background-color: rgb(225, 121, 121);
  }
`;

const attendanceStatusCheckBoxStyle = css`
  margin-top: auto;
  margin-bottom: auto;
  width: 35px;
  height: 25px;
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
        <p css={comingGuestStyle}>
          {' ' + guestAttributes.firstName} {guestAttributes.lastName} is a
          party 🐧
        </p>
      ) : (
        <p css={notComingGuestStyle}>
          {' ' + guestAttributes.firstName} {guestAttributes.lastName} is a lazy
          fluffy 🐼
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
    <div>
      <h1 css={wrapperStyle}> {title} </h1>

      <div css={inputWrapperStyle}>
        <label>
          First Name{' '}
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
          Last Name{' '}
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
      <img css={image} src={require('./567.jpg')} alt="lion" />
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
