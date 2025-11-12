import { Route, Routes } from "react-router-dom";
import DocumentCategoriesList from "./list";

export default function DocumentCategories() {
    return (
        <Routes>
            <Route index element={<DocumentCategoriesList />} />
        </Routes>
    );
}