import { create } from "zustand";
import { Location } from "../../../infrastructure/interfaces/location";
import { clearWatchLocation, getCurrentLocation, watchCurrentLocation } from "../../../actions/location/location";

interface LocationState {
    lastKnowLocation: Location | null;
    userlocationList: Location[];
    watchId: number | null;
    getLocation: () => Promise<Location | null>;
    watchLocation: () => void;
    clearWatchLocation: () => void;

}

export const useLocationStore = create<LocationState>()((set, get) => ({
    lastKnowLocation: null,
    userlocationList: [],
    watchId: null,
    getLocation: async () => {
        const location = await getCurrentLocation();
        set({ lastKnowLocation: location });
        return location;
    },

    watchLocation: () => {
        const watchId = get().watchId;
        if (watchId !== null) {
            get().clearWatchLocation();
        };

        const id = watchCurrentLocation((location) => {
            set({
                lastKnowLocation: location,
                userlocationList: [...get().userlocationList, location],
            })
        });
        set({ watchId: id });
    },

    clearWatchLocation: () => {
        const watchId = get().watchId;
        if (watchId !== null) {
            clearWatchLocation(watchId);
        };
    }

}));