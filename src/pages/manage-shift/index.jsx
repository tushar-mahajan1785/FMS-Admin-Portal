import { Route, Routes } from "react-router-dom";
import ManageShiftList from "./list";

export default function ManageShift() {
    return (
        <Routes>
            <Route index element={<ManageShiftList />} />
        </Routes>
    );
}