import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { api } from "../api";

const initialState = {
    teams: [],
    currentTeamId: null,
    currentCount: 0,
    currentPlayers: [],
    competition: "",
    dateCompetition: "",
    nameTeam: "",
    status: "idle",
    errorMessage: "",
};

// Fetch all teams
export const fetchTeams = createAsyncThunk(
    "teams/fetchTeams",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.listTeams.listTeamsList();
            return response.data;
        } catch (error) {
            return rejectWithValue("Ошибка при загрузке заявок");
        }
    }
);

// Fetch team data
export const fetchTeamData = createAsyncThunk(
    "teams/fetchTeamData",
    async (teamId, { rejectWithValue }) => {
        try {
            const response = await api.team.teamRead(teamId);
            console.log(response)
            return response.data;
        } catch (error) {
            return rejectWithValue("Заявка не найдена");
        }
    }
);

// Update tournament data
export const updateTournament = createAsyncThunk(
    "teams/updateTournament",
    async ({ teamId, competition, nameTeam, dateCompetition }, { rejectWithValue }) => {
        try {
            const response = await api.team.teamUpdate(teamId, {
                competition: competition,
                name_team: nameTeam,
                date_competition: dateCompetition,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete team
export const deleteTeam = createAsyncThunk(
    "teams/deleteTeam",
    async (teamId, { rejectWithValue }) => {
        try {
            await api.deleteTeam.deleteTeamDelete(teamId);
            return teamId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete player from team
export const deletePlayerFromTeam = createAsyncThunk(
    "teams/deletePlayerFromTeam",
    async ({ teamId, playerId }, { rejectWithValue }) => {
        try {
            await api.deleteFromTeam.deleteFromTeamPlayerDelete(teamId, playerId);
            return playerId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update captain status
export const updateCaptainStatus = createAsyncThunk(
    "teams/updateCaptainStatus",
    async ({ teamId, playerId, isCaptain }, { rejectWithValue }) => {
        try {
            const response = await api.addIsCaptain.addIsCaptainPlayerUpdate(teamId, playerId, { is_captain: isCaptain });
            return { playerId, isCaptain };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Form team
export const formTeam = createAsyncThunk(
    "teams/formTeam",
    async (teamId, { rejectWithValue }) => {
        try {
            await api.formTeam.formTeamUpdate(teamId);
            return teamId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const teamSlice = createSlice({
    name: "team",
    initialState,
    reducers: {
        setCurrentTeamId: (state, action) => {
            state.currentTeamId = action.payload;
        },
        setCurrentCount: (state, action) => {
            state.currentCount = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTeams.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchTeams.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.teams = action.payload;
            })
            .addCase(fetchTeams.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(fetchTeamData.pending, (state) => {
                state.status = "loading";
                state.errorMessage = "";
            })
            .addCase(fetchTeamData.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.currentPlayers = action.payload.players;
                state.competition = action.payload.competition;
                state.dateCompetition = action.payload.date_competition;
                state.nameTeam = action.payload.name_team;
            })
            .addCase(fetchTeamData.rejected, (state, action) => {
                state.status = "failed";
                state.errorMessage = action.payload;
            })
            .addCase(updateTournament.fulfilled, (state, action) => {
                state.competition = action.payload.competition;
                state.nameTeam = action.payload.name_team;
                state.dateCompetition = action.payload.date_competition;
            })
            .addCase(deleteTeam.fulfilled, (state) => {
                state.currentTeamId = null;
                state.currentCount = 0;
            })
            .addCase(deletePlayerFromTeam.fulfilled, (state, action) => {
                state.currentPlayers = state.currentPlayers.filter(
                    (player) => player.pk !== action.payload
                );
            })
            .addCase(updateCaptainStatus.fulfilled, (state, action) => {
                const { playerId, isCaptain } = action.payload;
                const player = state.currentPlayers.find((p) => p.pk === playerId);
                if (player) player.is_captain = isCaptain;
            })
            .addCase(formTeam.fulfilled, (state) => {
                state.currentTeamId = null;
                state.currentCount = 0;
            });
    },
});

export const { setCurrentTeamId, setCurrentCount } = teamSlice.actions;
export default teamSlice.reducer;
