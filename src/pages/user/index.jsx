import { Route, Routes } from "react-router-dom";
import UserList from "./list";

export default function Users() {
    return (
        <Routes>
            <Route index element={<UserList />} />
        </Routes>
    );
}