import { Route, Routes } from "react-router-dom";
import InventoryList from "./list";

export default function Inventory() {
    return (
        <Routes>
            <Route index element={<InventoryList />} />
        </Routes>
    );
}