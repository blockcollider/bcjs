const PublicClient = require('./public');

class AuthenticatedClient extends PublicClient {
    constructor(rpcUrl: string, authToken: string) {
        this.rpcUrl = rpcUrl;
        this.authToken = rpcUrl;
    }

    authenticate () {
    }

    createTakerOrder () {
    }

    createMakerOrder () {
    }

    unlockOutpoint () {

    }

}


export default AuthenticatedClient