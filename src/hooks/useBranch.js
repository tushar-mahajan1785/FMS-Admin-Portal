import { useContext } from 'react'
import { BranchContext } from '../context/branch/BranchContext'

export const useBranch = () => useContext(BranchContext)
