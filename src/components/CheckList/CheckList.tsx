import { useState, FC } from "react";
import classnames from "classnames";

import "./CheckList.scss";

type Props = {
  listItems: string[];
  onNameSelect: (selectedNames: string[]) => void;
  checkedItem?: string[];
  withLegend?: boolean;
};

const CheckList: FC<Props> = ({
  listItems,
  onNameSelect,
  checkedItem,
  withLegend = false,
}) => {
  const [selectedNames, setSelectedNames] = useState<string[]>(
    checkedItem ? checkedItem : []
  );
  const [selectAll, setSelectAll] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  const handleNameChange = (name: string) => {
    const updatedNames = selectedNames.includes(name)
      ? selectedNames.filter((selectedName) => selectedName !== name)
      : [...selectedNames, name];
    setSelectedNames(updatedNames);
    onNameSelect(updatedNames);
  };

  const handleSelectAllChange = () => {
    const allNames = listItems.map((item) => item);
    if (selectedNames.length === listItems.length) {
      setSelectedNames([]);
      setSelectAll(false);
      onNameSelect([]);
    } else {
      setSelectedNames(allNames);
      setSelectAll(true);
      onNameSelect(allNames);
    }
  };

  const handleClickLegend = () => {
    setListOpen(!listOpen);
  };

  return (
    <div className="check-list">
      {withLegend ? (
        <button
          type="button"
          onClick={handleClickLegend}
          className={classnames("check-list__legend", {
            "check-list__legend_open": listOpen,
          })}
        >
          <span className="check-list__caption-legend">
            {selectedNames.join("").length > 0
              ? selectedNames.join(" ").length > 23
                ? `${selectedNames[0]}...`
                : selectedNames.join(" ")
              : "Выберите права доступа"}
          </span>
        </button>
      ) : (
        ""
      )}
      <ul
        className={classnames("check-list__list", {
          "check-list__list_open": withLegend ? listOpen : true,
        })}
      >
        <li key={"Все"} className="check-list__item">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAllChange}
            className="check-list__input"
          />
          <label onClick={handleSelectAllChange} className="check-list__title">
            Все
          </label>
        </li>
        {listItems.map((item) => (
          <li key={item} className="check-list__item">
            <input
              type="checkbox"
              checked={selectedNames.includes(item)}
              onChange={() => handleNameChange(item)}
              className="check-list__input"
            />
            <label
              onClick={() => handleNameChange(item)}
              className="check-list__title"
            >
              {item}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { CheckList };
