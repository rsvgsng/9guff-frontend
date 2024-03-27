import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRoute } from '../utils/apiRoute';
import { fetchRetry } from '../utils/retryFetch';

export const fetchNotifications = createAsyncThunk("get/fetchNotifications", async () => {
    const response = await fetchRetry(`${apiRoute}/main/notifications`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
    });
    const data = await response.json();

    if (data.statusCode === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('cart');
        window.location.reload();
    }
    return data;
});

export const ping = createAsyncThunk("get/ping", async () => {
    const response = await fetchRetry(`${apiRoute}/main/ping`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
    });
    const data = await response.json();
    return data;
})

export const fetchCategoryData = createAsyncThunk("get/fetchCategoryData", async (category: any) => {
    const response = await fetchRetry(`${apiRoute}/main/c/${category}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
    });
    const data = await response.json();
    return data;
})

export const fetchRecentUsers = createAsyncThunk("get/fetchRecentUsers", async () => {
    const response = await fetchRetry(`${apiRoute}/main/recentlyActiveUsers`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
    });
    const data = await response.json();
    return data;
})


export const mainSlice = createSlice({
    name: 'mainSlice',
    initialState: {
        notifications: [],
        notiLoading: false,
        showWarning: false,
        isLoggedIn: false,
        userName: '',
        items: [] as any,
        hasMore: true,
        page: 1,
        homeItemsLoading: false,

        categoryData: [] as any,

        userType: '',
        isUserBanned: false,
        isUseronCooldown: false,

        recentUsersActiveData: [],


    },
    reducers: {
        getNotifications: (state, action) => {
            state.notifications = action.payload;
        },
        setWarning: (state, action) => {
            state.showWarning = action.payload;
        },
        setIsLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        },

        setUserType: (state, action) => {
            state.userType = action.payload;
        },

        setUserName: (state, action) => {
            state.userName = action.payload;
        },
        setUserOnCooldown: (state, action) => {
            state.isUseronCooldown = action.payload;
        },
        setUserBanned: (state, action) => {
            state.isUserBanned = action.payload;
        },
        addItem: (state, action) => {
            state.items.push(...action.payload);
        },
        setHasMore: (state, action) => {
            state.hasMore = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },

        setHomeItemsLoading: (state, action) => {
            state.homeItemsLoading = action.payload;
        },
        setCategoryData: (state, action) => {
            if (state.categoryData.find((e: any) => e.category === action.payload.category)) return;
            state.categoryData.push({
                category: action.payload.category,
                data: action.payload.data
            })
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.notiLoading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.notifications = action.payload;
                state.notiLoading = false;
            })
            .addCase(fetchNotifications.rejected, (state) => {
                state.notiLoading = false;
            })

            .addCase(fetchRecentUsers.fulfilled, (state, action) => {
                state.recentUsersActiveData = action.payload;
            })


    }
});

export const { getNotifications,
    setUserBanned,
    setUserOnCooldown,
    setUserType, setCategoryData, setHomeItemsLoading, setPage, addItem, setHasMore, setUserName, setIsLoggedIn, setWarning } = mainSlice.actions;
export default mainSlice.reducer;
