export default class PublicClient {
    private rpcUrl: URL;

    constructor(rpcUrl: string) {
        this.rpcUrl = new URL(rpcUrl);
    }

    public getOpenOrders() {
        return 'b';
    }

    public getLatestBlock() {
        return 'a';
    }
}
