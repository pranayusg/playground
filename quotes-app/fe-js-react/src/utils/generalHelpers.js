import Swal from "sweetalert2";

export const helpers = {
	getConfirmAlert: async (props) => {
		let result = await Swal.fire({
			showCancelButton: true,
			confirmButtonColor: "#5cb85c",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, add it!",
			...props,
		});
		return result;
	},
	getInvalidLoginAlert: async (props) => {
		let result = await Swal.fire({
			confirmButtonColor: "#5cb85c",
			cancelButtonColor: "#d33",
			...props,
		});
		return result;
	},
};
