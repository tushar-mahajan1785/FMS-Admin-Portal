import { Route, Routes } from "react-router-dom";
import AdminSettingList from "./list";

export default function AdminSetting() {
    return (
        <Routes>
            <Route index element={<AdminSettingList />} />
        </Routes>
    );
}