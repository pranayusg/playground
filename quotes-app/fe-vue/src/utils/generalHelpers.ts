import { useUserStore } from "@/stores/userStore";
import Swal from "sweetalert2";

export const helpers = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getConfirmAlert: async (props: any) => {
    const result = await Swal.fire({
      showCancelButton: true,
      confirmButtonColor: "#5cb85c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!",
      ...props,
    });
    return result;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getInvalidLoginAlert: async (props: any) => {
    const result = await Swal.fire({
      confirmButtonColor: "#5cb85c",
      cancelButtonColor: "#d33",
      ...props,
    });
    return result;
  },
  getUserLoggedIn() {
    const userStore = useUserStore();
    return userStore.userLoggedIn;
  },
  getLikedQuotes() {
    const userStore = useUserStore();
    return userStore.likedQuotes;
  },
  getDislikedQuotes() {
    const userStore = useUserStore();
    return userStore.dislikedQuotes;
  },
  updateReactedQuotes() {
    const userStore = useUserStore();
    return userStore.fetchQuotes();
  },
  logout() {
    const userStore = useUserStore();
    return userStore.logoutUser();
  },
};
