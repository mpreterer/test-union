import type { RootState } from "../../index";

const usersSelector = (state: RootState) => state.users.users;
const statusSelect = (state: RootState) => state.users.status;

export { usersSelector, statusSelect };
