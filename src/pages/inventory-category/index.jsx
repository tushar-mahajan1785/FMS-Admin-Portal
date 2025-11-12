import { Route, Routes } from "react-router-dom";
import CategoryList from "./list";

export default function InventoryCategory() {
    return (
        <Routes>
            <Route index element={<CategoryList />} />
        </Routes>
    );
}