import React, { useState } from "react";

export default ({ onFilterChange, questionsWithScore }) => {
  const [filter, setFilter] = useState(NaN);
  const onFilterInputChange = e => {
    const updatedFilter = parseInt(e.target.value);
    setFilter(updatedFilter);
    onFilterChange({ filter: updatedFilter });
  };
  return (
    <div id="records">
      <div>
        <label>
          <input
            type="radio"
            checked={isNaN(filter)}
            name="filter"
            onChange={onFilterInputChange}
            value=""
          />
          <span>all</span>
        </label>
      </div>
      {questionsWithScore.map((triples, i) => (
        <div key={i}>
          <label>
            <input
              type="radio"
              checked={filter === triples[0][0]}
              name="filter"
              onChange={onFilterInputChange}
              value={triples[0][0]}
            />
            <span>{triples[0][0]}×?</span>
          </label>
          {triples.map(([x, y, z]) => (
            <span className="wrapper" key={x + "-" + y}>
              <span
                key={x + "-" + y}
                className={[
                  `priority-${z}`,
                  ...(isNaN(filter) || x === filter || y === filter
                    ? []
                    : ["disabled"])
                ].join(" ")}
              >
                {x + "×" + y}
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};
