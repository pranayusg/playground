export interface SystemUsersState {
	username: {
		id: string;
		name: string;
	};
	type: string;
	lastLoggedIn?: Date;
	state?: {
		batch: {
			tech: string;
			status: string;
			fileName: string;
			sortOrder: string;
			sortColumn: string;
		};
		global: {
			theme: string;
			noOfRecords: number;
		};
		employee: {
			fileName: string;
			sortOrder: string;
			searchText: string;
			sortColumn: string;
			employeeType: string;
		};
		certification: {
			Approved: {
				fileName: string;
				sortOrder: string;
				sortColumn: string;
			};
			Achieved: {
				fileName: string;
				sortOrder: string;
				sortColumn: string;
			};
			certificationType: string;
			activeTab: number;
		};
		trainingDashboard: {
			fileName: string;
			sortOrder: string;
			searchText: string;
			sortColumn: string;
		};
		normalizedBatch: {
			tech: string;
			status: string;
			sortColumn: string;
			sortOrder: string;
			fileName: string;
		};
		normalizedEmployee: {
			fileName: string;
			sortOrder: string;
			searchText: string;
			sortColumn: string;
		};
		normalizedCertification: {
			Approved: {
				fileName: string;
				sortOrder: string;
				sortColumn: string;
			};
			Achieved: {
				fileName: string;
				sortOrder: string;
				sortColumn: string;
			};
			certificationType: string;
			activeTab: number;
		};
		normalizedTrainingDetails: {
			searchText: string;
			fileName: string;
		};
		viewAssignment: {
			searchText: string;
			sortColumn: string;
			sortOrder: string;
			fileName: string;
		};
		batchAssignment: {
			sortColumn: string;
			sortOrder: string;
			fileName: string;
		};
		feedbackAssignment: {
			searchEmployee: string;
			status: string;
			sortColumn: string;
			sortOrder: string;
			fileName: string;
		};
		traineeFeedback: {
			parentBatch: string;
			childBatch: string;
			sortColumn: string;
			sortOrder: string;
			fileName: string;
		};
	};
}
