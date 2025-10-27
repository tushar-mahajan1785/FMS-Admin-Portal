import { Route, Routes } from "react-router-dom";
import SettingList from "./list";

export default function Settings() {
    return (
        <Routes>
            <Route index element={<SettingList />} />
        </Routes>
    );
}