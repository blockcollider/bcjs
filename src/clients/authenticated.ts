import PublicClient from './public';

export default class AuthenticatedClient extends PublicClient {
    private authToken: string;

    constructor(rpcUrl: string, authToken: string) {
        super(rpcUrl);
        this.authToken = rpcUrl;
    }

    public authenticate(): void {
        return;
    }

    public createTakerOrder(): void {
        return;
    }

    public createMakerOrder(): void {
        return;
    }

    public unlockOutpoint(): void {
        return;
    }
}
