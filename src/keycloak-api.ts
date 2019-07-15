import KeycloakAdminClient from 'keycloak-admin';
import { requireOne } from './util.js';

const clientConfig = {
    baseUrl: process.env.IAM_URL,
    realmName: process.env.IAM_REALM,
};

const authConfig = {
    username: process.env.IAM_ADMIN_USER,
    password: process.env.IAM_ADMIN_PASS,
    grantType: 'password',
    clientId: process.env.IAM_CLIENT_ID,
    clientSecret: process.env.IAM_CLIENT_SECRET,
};

export const getKeycloakAdmin = () => {
    /*
     * TODO: Use RxJS to return a Observable instead of a Promise and:
     * - connects on demand
     * - refreshes the access token
     * - reconnects when refreshing fails
     */
    const kcAdminClient = new KeycloakAdminClient(clientConfig);

    return kcAdminClient.auth(authConfig).then(() => kcAdminClient);
};

export const userExists = (username: string): Promise<boolean> =>
    getKeycloakAdmin()
        .then(kcAdminClient => kcAdminClient.users.findOne({ username } as any))
        .then(requireOne)
        .then(() => true, () => false);

export const getAllUsers = () => getKeycloakAdmin().then(kcAdminClient => kcAdminClient.users.find());

module.exports = {
    getAllUsers,
    getKeycloakAdmin,
    userExists,
};