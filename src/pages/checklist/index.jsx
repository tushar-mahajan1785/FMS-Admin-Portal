import { Route, Routes } from "react-router-dom";
import ChecklistAssetTypes from "./asset-type";
import ChecklistAssetGroups from "./asset-groups";
import ChecklistView from "./view";

export default function Checklist() {
    return (
        <Routes>
            <Route index element={<ChecklistAssetTypes />} />
            <Route path="asset-groups/:assetId/view/:groupUuid" element={<ChecklistView />} />
            <Route path="asset-groups/:assetId" element={<ChecklistAssetGroups />} />
        </Routes>
    );
}