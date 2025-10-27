import { Route, Routes } from "react-router-dom";
import EmployeeList from "./list";
import EmployeeBulkUpload from "./bulk-upload";

export default function Employees() {
    return (
        <Routes>
            <Route index element={<EmployeeList />} />
            <Route path="/bulk-upload" element={<EmployeeBulkUpload />} />
        </Routes>
    );
}