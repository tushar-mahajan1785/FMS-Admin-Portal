import { Route, Routes } from "react-router-dom";
import DocumentsList from "./list";
import ViewDocument from "./view";
import CategoriesDetails from "./categories-details";

export default function Documents() {
    return (
        <Routes>
            <Route index element={<DocumentsList />} />
            <Route path="/view/:uuid/categories-details/:documentCategoryUuid" element={<CategoriesDetails />} />
            <Route path="/view/:uuid" element={<ViewDocument />} />
        </Routes>
    );
}