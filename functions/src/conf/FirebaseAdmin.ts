import * as admin from "firebase-admin";

import serviceAccount from "./secrets/FirebaseKeys.json";

admin.initializeApp({
  projectId: serviceAccount.project_id,
  credential: admin.credential.cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
  }),
});

export default admin;
