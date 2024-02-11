import axios from "axios";
import { useEffect, useState } from "react";

const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState("");

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  async function fetchValues() {
    const { data } = await axios.get("/api/values/current");
    setValues({ values: data });
  }
  async function fetchIndexes() {
    const indexes = await axios.get("/api/values/all");
    setSeenIndexes(indexes.data);
  }

  function renderSeenIndexes() {
    return seenIndexes.map(({ number }) => number).join(", ");
  }

  function renderValues() {
    const entries = [];
    for (let key in values.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values.values[key]}
        </div>
      );
    }
    return entries;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await axios.post("/api/values", {
      index,
    });
    setIndex("");
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index:</label>
        <input
          value={index}
          onChange={(event) => setIndex(event.target.value)}
        />
        <button>Submit</button>
      </form>

      <h3>Indexes I've seen:</h3>
      {renderSeenIndexes()}

      <h3>Calculated Values:</h3>
      {renderValues()}
    </div>
  );
};

export default Fib;