import React from 'react'
import { RecentTicket } from './recent'
import { Route, Routes } from 'react-router-dom'

export const Tickets = () => {
    return (
        <Routes>
            <Route index element={<RecentTicket />} />
            {/* <Route path="/bulk-upload" element={<AssetBulkUpload />} /> */}
        </Routes>
    )
}
