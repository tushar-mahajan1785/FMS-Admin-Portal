import { Route, Routes } from "react-router-dom";
import VendorList from "./list";
import VendorBulkUpload from "./bulk-upload";

export default function Vendors() {
    return (
        <Routes>
            <Route index element={<VendorList />} />
            <Route path="/bulk-upload" element={<VendorBulkUpload />} />
        </Routes>
    );
}