import admin from "firebase-admin";
import serviceAccount from "../../firebase-config/et-firebase-service-account.json";
import { ServiceAccount } from "firebase-admin";

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount as ServiceAccount),
	databaseURL: "https://expense-tracker-29842-default-rtdb.firebaseio.com/",
});

export default admin;
