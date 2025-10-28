import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchReports = createAsyncThunk("reports/fetch", async () => {
  const res = await api.get("/reports/my");
  return res.data;
});

export const addReport = createAsyncThunk(
  "reports/add",
  async (data: FormData) => {
    const res = await api.post("/reports", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }
);

const reportSlice = createSlice({
  name: "reports",
  initialState: {
    reports: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load reports";
      })
      .addCase(addReport.fulfilled, (state, action) => {
        state.reports.push(action.payload);
      });
  },
});

export default reportSlice.reducer;
