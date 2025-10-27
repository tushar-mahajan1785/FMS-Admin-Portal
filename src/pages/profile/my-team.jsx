import React, { useEffect, useState } from 'react'
import TypographyComponent from '../../components/custom-typography'
import CategoryTreeList from '../../components/custom-tree-list'
import { useSelector } from 'react-redux'
import { IMAGES_SCREEN_NO_DATA } from '../../constants'
import EmptyContent from '../../components/empty_content'

export const ProfileMyTeam = () => {

    //Store
    const { getUserProfileDetails } = useSelector(state => state.CommonStore)

    //State
    const [usersMyTeamData, setUsersMyTeamData] = useState([]);

    /**
     * useEffect
     * @dependency : getUserProfileDetails
     * @type : HANDLE API RESULT
     * @description : Handle the result of user profile details API
     */
    useEffect(() => {
        if (getUserProfileDetails && getUserProfileDetails !== null) {
            if (getUserProfileDetails?.result === true) {
                if (getUserProfileDetails?.response?.team && getUserProfileDetails?.response?.team !== null && getUserProfileDetails?.response?.team.length > 0) {
                    setUsersMyTeamData(getUserProfileDetails?.response?.team)
                }

            } else {
                setUsersMyTeamData([])
            }
        }
    }, [getUserProfileDetails])

    return (
        <>
            <TypographyComponent fontSize={20} sx={{ mb: 2 }}>My Team</TypographyComponent>
            {
                usersMyTeamData && usersMyTeamData !== null && usersMyTeamData.length > 0 ?
                    <CategoryTreeList dataArray={usersMyTeamData} />
                    :
                    <React.Fragment>
                        <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Team Added'} subTitle={''} />
                    </React.Fragment>

            }
        </>
    )
}
