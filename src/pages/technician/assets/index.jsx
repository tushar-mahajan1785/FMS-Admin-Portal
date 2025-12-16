

import { Route, Routes } from "react-router-dom";
import TechnicianAssetList from "./list";
import TechnicianAssetView from "./view";

export default function TechnicianAsset() {
    return (
        <Routes>
            <Route index element={<TechnicianAssetList />} />
            <Route path="view/:assetUuid" element={<TechnicianAssetView />} />
        </Routes>
    );
}
