/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// ** Config
import { axiosApi } from '../../../common/api';
import { ERROR, SERVER_ERROR } from '../../../constants';
import authConfig from '../../../config/auth';
import { AuthContext } from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useBranch } from "../../../hooks/useBranch";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const navigate = useNavigate()
  const location = useLocation();
  const params = useParams();
  const { showSnackbar } = useSnackbar()
  const branch = useBranch()

  //INIT - Verifying token function
  const verifyToken = async () => {
    setLoading(true);
    // TODO: call verify API

    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
    if (storedToken) {
      setLoading(true)
      await axiosApi
        .get(authConfig.meEndpoint, {
          headers: {
            authorization: `Token ${storedToken}`
          }
        })
        .then(async response => {
          setLoading(false)
          if (response.data.result === true) {
            setPermissions(JSON.stringify(response.data.response.userData?.ability))
            setUser({ ...response.data.response.userData })
            branch.setAllBranches(response.data.response.userData.branch)
            if (response.data.response.userData.branch.length > 0) {
              let currentBranch;

              let branchArr = response.data.response.userData.branch || []
              // If no saved branch or UUID is invalid, fallback to is_selected branch
              if (!currentBranch) {
                currentBranch = branchArr.find(
                  objBranch => objBranch.is_selected === true
                );
              }

              // If a valid current branch is found, set it and save to local storage
              if (currentBranch) {
                branch.setCurrentBranch(currentBranch);
              }
            }
            navigate(location.pathname, { replace: true })

          } else {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            navigate('/login')
          }
        })
        .catch(() => {
          console.log('JWT REFRESH SCREEN ERROR');
          // console.log(err);
          localStorage.removeItem('userData')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('accessToken')
          setUser(null)
          setLoading(false)
          if (authConfig.onTokenExpiration === 'logout' && !location.pathname.includes('login')) {
            navigate('/login')
          }
        })
    } else {
      setLoading(false)
    }
  };

  // Verify token on initial app load
  useEffect(() => {
    verifyToken();
  }, []);

  //Login function
  const login = (input, header, errorCallback) => {

    const { headers } = header;

    axiosApi
      .post(authConfig.loginEndpoint, input, { headers })
      .then(async response => {

        let responseData = response.data
        if (responseData.result === true) {
          window.localStorage.setItem(authConfig.storageTokenKeyName, responseData.response.refreshToken)
          window.localStorage.setItem(authConfig.accessToken, responseData.response.accessToken)
          setPermissions(JSON.stringify(response.data.response.userData?.ability))

          const returnUrl = params.returnUrl
          setUser({ ...responseData?.response?.userData })
          branch.setAllBranches(response.data.response.userData.branch)

          if (response.data.response.userData.branch.length > 0) {
            let currentBranch;

            let branchArr = response.data.response.userData.branch || []
            // If no saved branch or UUID is invalid, fallback to is_selected branch
            if (!currentBranch) {
              currentBranch = branchArr.find(
                objBranch => objBranch.is_selected === true
              );

            }

            // If a valid current branch is found, set it and save to local storage
            if (currentBranch) {
              branch.setCurrentBranch(currentBranch);
            }
          }
          const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

          navigate(redirectURL, { replace: true })
        } else {
          let errorObj = {
            code: ERROR,
            message: responseData?.message
          }
          errorCallback(errorObj)
        }
      })
      .catch(() => {

        let errorObj = {
          code: SERVER_ERROR,
          message: 'Internal server error'
        }
        errorCallback(errorObj)
      })
  }

  // Logout function
  const logout = (params) => {
    let type = params && params !== null ? params : null

    setUser(null);
    window.localStorage.clear()
    toast.dismiss()
    if (type !== 'logout') {
      showSnackbar({ message: "Session expired. Please log in again", severity: "error" })
    }
    navigate('/login')
  }

  /**
   * Cleans and normalizes permissions input
   * @param {*} permissions 
   * @returns 
   */
  const getCleanPermissions = (permissions) => {
    if (!permissions) return [];

    try {
      // Normalize to array
      let permsArray = Array.isArray(permissions) ? permissions : JSON.parse(permissions || '[]');

      // If parsing fails or isn't an array, split by comma
      if (!Array.isArray(permsArray)) {
        permsArray = permissions.split(',');
      }

      // Clean up quotes, brackets, and spaces
      return permsArray.map((p) => p.replace(/^["[]|["\]]$/g, '').trim()).filter(Boolean);
    } catch {
      // Final fallback for invalid JSON
      return permissions.toString().split(',').map((p) => p.replace(/^["[]|["\]]$/g, '').trim()).filter(Boolean);
    }
  };

  /**
   * Checking whether user has specific permission
   * @param {*} perm 
   * @returns 
   */
  const hasPermission = (perm) => {
    const permsArray = getCleanPermissions(permissions);

    const result = permsArray.includes(perm);

    return result;
  };


  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, verifyToken, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

