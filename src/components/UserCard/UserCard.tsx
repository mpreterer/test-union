import { FC, useState } from "react";
import classnames from "classnames";

import { Modal } from "../Modal/Modal";
import { CheckList } from "../CheckList/CheckList";

import { User } from "../../types/User";
import {
  permissionsEmpty,
  permissionsList,
  permissionsType,
} from "./constants";
import defaultAvatar from "../../assets/images/default-avatar.svg";
import "./UserCard.scss";
import { FirebaseAPI } from "../../FirebaseAPI";
import { useAppDispatch } from "../../hooks/redux";
import { fetchUsers } from "../../store/slices/users/slice";

const UserCard: FC<User> = ({ name, email, permissions, image, id }) => {
  const dispatch = useAppDispatch();

  const [letterEmail, setLetterEmail] = useState("");
  const [permissionsUser, setPermissionsUser] = useState<string[]>(permissions);
  const [panelOpen, setPanelOpen] = useState(false);
  const [currentModalName, setCurrentModalName] = useState<
    null | "letterSended" | "formSendLetter" | "delete" | "changePermissions"
  >(null);

  const handleClickCheckBox = async (selectedNames: string[]) => {
    if (selectedNames.length === 0) {
      setPermissionsUser([permissionsEmpty]);
      await FirebaseAPI.changePermissions(id, [permissionsEmpty]);
      return;
    }

    if (selectedNames.includes(permissionsEmpty)) {
      selectedNames.shift();
    }

    setPermissionsUser(selectedNames);
    await FirebaseAPI.changePermissions(id, selectedNames);
  };

  const handleClickDeleteUser = async () => {
    await FirebaseAPI.deleteUser(id).then(() => {
      setCurrentModalName("delete");
    });
    setTimeout(() => {}, 1000);
    await dispatch(fetchUsers());
  };

  return (
    <li className="user-card">
      <div className="user-card__info">
        <img
          className="user-card__avatar"
          src={!image ? defaultAvatar : image}
          alt="аватар"
        />
        <div className="user-card__info-container">
          <div className="user-card__about-container">
            <span className="user-card__name">
              {!name ? "Пользователь" : name}
            </span>
            <span className="user-card__status-instance">{}</span>
            <span className="user-card__email">{email}</span>
          </div>
          <ul className="user-card__list-permissions">
            {permissionsUser.map((item) => (
              <li
                className={classnames("user-card__permission", {
                  "user-card__permission_special":
                    item.toLowerCase() === permissionsType.admin,
                })}
                key={item}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="user-card__functional-panel-container">
        <button
          className="user-card__functional-panel-btn"
          onClick={() => setPanelOpen(!panelOpen)}
        />
        <div
          className={classnames("user-card__functional-panel", {
            "user-card__functional-panel_open": panelOpen,
          })}
        >
          <button
            className="user-card__button"
            onClick={() => setCurrentModalName("changePermissions")}
          >
            Изменить права доступа
          </button>
          <Modal
            isActive={currentModalName === "changePermissions"}
            onClickClose={() => setCurrentModalName(null)}
          >
            {currentModalName === "changePermissions" ? (
              <div className="user-card__check-list-container">
                <CheckList
                  listItems={permissionsList}
                  onNameSelect={handleClickCheckBox}
                  checkedItem={permissionsUser}
                />
              </div>
            ) : (
              ""
            )}
          </Modal>
          <button
            className="user-card__button"
            onClick={() => setCurrentModalName("formSendLetter")}
          >
            Отправить код повторно
          </button>
          <Modal
            isActive={currentModalName === "formSendLetter"}
            onClickClose={() => setCurrentModalName(null)}
          >
            {currentModalName === "formSendLetter" ? (
              <div className="user-card__modal">
                <div className="user-card__modal-title">
                  Отправьте приглашение
                </div>
                <input
                  className="user-card__modal-input"
                  value={letterEmail}
                  onChange={(event) => setLetterEmail(event.target.value)}
                  placeholder="Email"
                  type="email"
                />
                <div className="user-card__permissions-modal">
                  <CheckList
                    listItems={permissionsList}
                    onNameSelect={() => {}}
                    withLegend
                  />
                </div>
                <button
                  className="user-card__modal-btn"
                  onClick={() => setCurrentModalName("letterSended")}
                >
                  Отправить приглашение
                </button>
              </div>
            ) : (
              ""
            )}
          </Modal>
          <Modal
            isActive={currentModalName === "letterSended"}
            onClickClose={() => setCurrentModalName(null)}
          >
            {currentModalName === "letterSended" ? (
              <div className="user-card__modal">
                <div className="user-card__modal-title">
                  Приглашение отправлено на почту {email}
                </div>
                <button
                  className="user-card__modal-btn"
                  onClick={() => setCurrentModalName(null)}
                >
                  Закрыть
                </button>
              </div>
            ) : (
              ""
            )}
          </Modal>
          <button className="user-card__button" onClick={handleClickDeleteUser}>
            Удалить
          </button>
          <Modal
            isActive={currentModalName === "delete"}
            onClickClose={() => setCurrentModalName(null)}
          >
            {currentModalName === "delete" ? (
              <div className="user-card__modal">
                <div className="user-card__modal-title">
                  Пользователь успешно удален
                </div>
                <button
                  className="user-card__modal-btn"
                  onClick={() => setCurrentModalName(null)}
                >
                  Закрыть
                </button>
              </div>
            ) : (
              ""
            )}
          </Modal>
        </div>
      </div>
    </li>
  );
};

export { UserCard };
