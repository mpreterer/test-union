import { FC, useEffect, useState } from "react";

import { UserCard } from "../../components/UserCard/UserCard";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  statusSelect,
  usersSelector,
} from "../../store/slices/users/selectors";

import { Modal } from "../../components/Modal/Modal";
import { CheckList } from "../../components/CheckList/CheckList";

import {
  permissionsEmpty,
  permissionsList,
} from "../../components/UserCard/constants";
import { User } from "../../types/User";
import { fetchUsers } from "../../store/slices/users/slice";
import { NewUser } from "../../types/NewUser";
import { FirebaseAPI } from "../../FirebaseAPI";
import "./TeamPage.scss";

const TeamPage: FC = () => {
  const dispatch = useAppDispatch();

  const users: Record<string, User> = useAppSelector(usersSelector);
  const statusUser = useAppSelector(statusSelect);

  const [searchEmail, setSearchEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [currentModalName, setCurrentModalName] = useState<null | "addUser">(
    null
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleClickCheckBox = (selectedNames: string[]) => {
    setPermissions(selectedNames);
  };

  const handleClickAddUser = async () => {
    const newUser: NewUser = {
      name: userName,
      email: userEmail,
      permissions: permissions,
      image: "",
    };

    if (!userName.trim()) {
      alert("Введите имя");
      return;
    }

    if (!userEmail.trim()) {
      alert("Введите почту");
      return;
    } else if (!userEmail.includes("@") || !userEmail.includes(".")) {
      alert("Почта не валидна");
      return;
    }

    if (permissions.length === 0) {
      newUser.permissions.push(permissionsEmpty);
    }

    //@ts-ignore
    let useEmail = Object.values(users).filter((item: NewUser) =>
      item.email.includes(userEmail.trim())
    );

    if (useEmail.length > 0) {
      alert("Такая почта уже используется");
      setUserEmail("");
      return;
    }

    setUserName("");

    await FirebaseAPI.addUser(newUser);
    // не успел починить баг, поэтому 2 запроса
    await dispatch(fetchUsers());
    await dispatch(fetchUsers());
    setCurrentModalName(null);
  };

  const handleChangeSearchEmail = (value: string) => {
    setSearchEmail(value);
  };

  return (
    <div className="team-page">
      <div className="team-page__functional-panel">
        <h1 className="team-page__title">Команда</h1>
        <div className="team-page__buttons">
          <div className="team-page__search-container">
            <input
              className="team-page__search"
              placeholder="Поиск по Email"
              onChange={(e) => handleChangeSearchEmail(e.target.value)}
              value={searchEmail}
            />
          </div>
          <button
            className="team-page__add-user"
            onClick={() => setCurrentModalName("addUser")}
          >
            Добавить пользователя
          </button>
          <Modal
            isActive={currentModalName === "addUser"}
            onClickClose={() => setCurrentModalName(null)}
          >
            {currentModalName === "addUser" ? (
              <form className="team-page__form-add-user">
                <input
                  type="text"
                  className="team-page__input-info-user"
                  placeholder="Имя пользователя"
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                />
                <input
                  type="email"
                  className="team-page__input-info-user"
                  placeholder="email"
                  value={userEmail}
                  onChange={(event) => setUserEmail(event.target.value)}
                />
                <div className="team-page__container-check-list">
                  <CheckList
                    listItems={permissionsList}
                    onNameSelect={handleClickCheckBox}
                    withLegend
                  />
                </div>
                <button
                  className="team-page__add-user"
                  onClick={handleClickAddUser}
                  type="button"
                >
                  Добавить пользователя
                </button>
              </form>
            ) : (
              ""
            )}
          </Modal>
        </div>
      </div>
      <ul className="team-page__users-list">
        {statusUser === "loading" ? (
          <p style={{ marginLeft: 25, marginTop: 20 }}>
            Загрузка пользователей...
          </p>
        ) : (
          ""
        )}
        {users ? (
          Object.entries(users).map(([key, value]: [string, User]) => (
            <UserCard
              id={key}
              key={key}
              name={value.name}
              email={value.email}
              permissions={value.permissions}
              image={value.image}
            />
          ))
        ) : (
          <li style={{ marginLeft: 25, marginTop: 20 }}>
            Список пользователей пуст
          </li>
        )}
      </ul>
    </div>
  );
};

export default TeamPage;
