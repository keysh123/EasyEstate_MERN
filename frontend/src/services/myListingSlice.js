import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getListings = createAsyncThunk(
  "listings/getListings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/listings/get-listing`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();
      // console.log(data);

      if (!data.success) {
        return rejectWithValue(data.message || "Failed to fetch listings");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);
export const deleteListing = createAsyncThunk(
  "listings/deleteListing",
  async (listingId, { rejectWithValue }) => {
    try {
      console.log(listingId);

      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/listings/delete-listing/${listingId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message || "Failed to delete listing");
      }

      return listingId; // returning ID to remove from local state
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);
export const editListing = createAsyncThunk(
  "listings/editListing",
  async ({ listingId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/listings/edit-listing/${listingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updatedData),
        }
      );

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message || "Failed to edit listing");
      }

      return data; // Assuming your backend returns updated listing
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);
export const createListing = createAsyncThunk(
  "listings/createListing",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/listings/create-listing`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message || "Failed to create listing");
      }

      return data.listing;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);
const initialState = {
  listings: false,
  error: null,
  loading: false,
};

const myListingSlice = createSlice({
  name: "myListing",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getListings.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(action.payload.listings);

        state.listings = action.payload.listings;
      })
      .addCase(getListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(deleteListing.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = state.listings.filter(
          (listing) => listing._id !== action.payload
        );
        toast.success("Listing deleted successfully");
      })
      .addCase(deleteListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(editListing.pending, (state) => {
        state.loading = true;
      })
      .addCase(editListing.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        
        state.listings = state.listings.map((listing) =>
          listing._id === action.payload.listing._id ? action.payload.listing : listing
        );
        toast.success("Listing updated successfully");
      })
      .addCase(editListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(createListing.pending, (state) => {
        state.loading = true;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = [action.payload.listing, ...(state.listings || [])]; // Add new listing to start
        toast.success("Listing created successfully");
      })
      .addCase(createListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message);
      });
  },
});

export default myListingSlice.reducer;
