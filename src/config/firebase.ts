import admin from "firebase-admin";
import serviceAccount from "../../firebase-config/et-firebase-service-account.json";
import { ServiceAccount } from "firebase-admin";

const firebaseConfig = {
	type: process.env.FIREBASE_TYPE,
	project_id: process.env.FIREBASE_PROJECT_ID,
	private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
	private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Handle newline characters
	client_email: process.env.FIREBASE_CLIENT_EMAIL,
	client_id: process.env.FIREBASE_CLIENT_ID,
	auth_uri: process.env.FIREBASE_AUTH_URI,
	token_uri: process.env.FIREBASE_TOKEN_URI,
	auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
	client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
	universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

admin.initializeApp({
	// credential: admin.credential.cert(serviceAccount as ServiceAccount),
	credential: admin.credential.cert(firebaseConfig as ServiceAccount),
	databaseURL: "https://expense-tracker-29842-default-rtdb.firebaseio.com/",
});

export default admin;
