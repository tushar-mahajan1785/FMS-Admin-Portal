import React from 'react'
import { RecentTicket } from './recent'
import { Route, Routes } from 'react-router-dom'
import { TicketList } from './list'

export const Tickets = () => {
    return (
        <Routes>
            <Route index element={<RecentTicket />} />
            <Route path="/list" element={<TicketList />} />
        </Routes>
    )
}
