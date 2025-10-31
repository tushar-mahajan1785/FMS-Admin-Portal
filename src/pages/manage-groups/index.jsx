import { Route, Routes } from "react-router-dom";
import ManageGroupsList from "./list";

export default function ManageGroups() {
    return (
        <Routes>
            <Route index element={<ManageGroupsList />} />
        </Routes>
    );
}