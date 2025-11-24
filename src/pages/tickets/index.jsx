import React from 'react'
import RecentTicket from './recent'
import { Route, Routes } from 'react-router-dom'
import TicketList from './all'
import TicketDownloadReport from './download'

export default function Tickets() {
    return (
        <Routes>
            <Route index element={<RecentTicket />} />
            <Route path="all" element={<TicketList />} />
            <Route path="download/:uuid" element={<TicketDownloadReport />} />
        </Routes>
    )
}
