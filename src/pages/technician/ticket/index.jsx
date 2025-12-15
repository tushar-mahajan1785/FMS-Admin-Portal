import React from 'react'
import TicketsList from './list'
import { Route, Routes } from 'react-router-dom'
import TicketView from './view'

export default function Tickets() {
    return (
        <Routes>
            <Route index element={<TicketsList />} />
            <Route path="view/:ticketUuid" element={<TicketView />} />
        </Routes>
    )
}
