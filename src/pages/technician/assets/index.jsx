

import { Route, Routes } from "react-router-dom";
import TechnicianAssetList from "./list";

export default function TechnicianAsset() {
    return (
        <Routes>
            <Route index element={<TechnicianAssetList />} />
            {/* <Route path="/bulk-upload" element={<AssetBulkUpload />} /> */}
        </Routes>
    );
}
