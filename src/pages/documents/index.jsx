import { Route, Routes } from "react-router-dom";
import DocumentsList from "./list";

export default function Documents() {
    return (
        <Routes>
            <Route index element={<DocumentsList />} />
        </Routes>
    );
}