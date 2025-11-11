import { Route, Routes } from "react-router-dom";
import DocumentsList from "./list";
import ViewDocument from "./view";

export default function Documents() {
    return (
        <Routes>
            <Route index element={<DocumentsList />} />
            <Route path="/view/:uuid" element={<ViewDocument />} />
        </Routes>
    );
}