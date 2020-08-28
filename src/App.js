import React from "react";
import axios from "axios";

const URL = "http://hn.algolia.com/api/v1/search";

function getUser() {
  return Promise.resolve({ id: "1", name: "Robin" });
}

function App() {
  const [search, setSearch] = React.useState("");
  const [search2, setSearch2] = React.useState("");
  const [user, setUser] = React.useState(null);
  const [stories, setStories] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const loadUser = async () => {
      const user = await getUser();
      setUser(user);
    };

    loadUser();
  }, []);

  function handleChange(event) {
    setSearch(event.target.value);
  }

  function handleChange2(event) {
    setSearch2(event.target.value);
  }

  async function handleFetch(event) {
    let result;

    try {
      result = await axios.get(`${URL}?query=React`);

      setStories(result.data.hits);
    } catch (error) {
      setError(error);
    }
  }

  return (
    <div>
      {user ? <p>Signed in as {user.name}</p> : null}

      <Search value={search} onChange={handleChange}>
        Search:
      </Search>

      <p>Searches for {search ? search : "..."}</p>

      <SearchNoSideEffectsOrState value={search2} onChange={handleChange2}>
        Surch:
      </SearchNoSideEffectsOrState>

      <p>Surches for {search2 ? search2 : "..."}</p>

      <button type="button" onClick={handleFetch}>
        Fetch Stories
      </button>

      {error && <span>Something went wrong ...</span>}

      <ul>
        {stories.map((story) => (
          <li key={story.objectID}>
            <a href={story.url}>{story.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Search({ value, onChange, children }) {
  return (
    <div>
      <label htmlFor="search">{children}</label>
      <input id="search" type="text" value={value} onChange={onChange} />
    </div>
  );
}

export function SearchNoSideEffectsOrState({ value, onChange, children }) {
  return (
    <div>
      <label htmlFor="search2">{children}</label>
      <input id="search2" type="text" value={value} onChange={onChange} />
    </div>
  );
}

export default App;
