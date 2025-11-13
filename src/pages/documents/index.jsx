import { Route, Routes } from "react-router-dom";
import DocumentsList from "./list";
import ViewDocument from "./view";
import CategoriesDetails from "./categories-details";

export default function Documents() {
    return (
        <Routes>
            <Route index element={<DocumentsList />} />
            <Route path="/view/:uuid" element={<ViewDocument />} />
            <Route path="/categories-details/:document_category_uuid" element={<CategoriesDetails />} />
        </Routes>
    );
}