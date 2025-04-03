import { env } from "./config";
import { Engine } from "@thirdweb-dev/engine";

/**
 * EngineService provides specialized methods for interacting with Thirdweb Engine
 */
export class EngineService {
  private engine: Engine;

  /**
   * Creates a new EngineService
   *
   * @param url - URL of the Thirdweb Engine
   * @param accessToken - Access token for authentication
   */
  constructor(url: string, accessToken: string) {
    this.engine = new Engine({
      url,
      accessToken,
    });
  }

  /**
   * Get the Engine instance
   * @returns Engine instance
   */
  public getEngine(): Engine {
    return this.engine;
  }

  /**
   * Creates a new wallet with the given label
   *
   * @param label - Label for the new wallet
   * @returns A promise resolving to the created wallet
   */
  public async createWallet(label: string) {
    try {
      return await this.engine.backendWallet.create({ label, type: "local" });
    } catch (error) {
      console.error("Error creating wallet:", error);
      throw error;
    }
  }

  /**
   * Gets all wallets
   *
   * @returns A promise resolving to an array of wallets
   */
  public async getAllWallets() {
    try {
      return await this.engine.backendWallet.getAll();
    } catch (error) {
      console.error("Error getting wallets:", error);
      throw error;
    }
  }
}

/**
 * Creates an EngineService with the given URL and access token
 *
 * @param url - URL of the Thirdweb Engine
 * @param accessToken - Access token for authentication
 * @returns A configured EngineService instance
 */
export const createEngineService = (
  url: string = env.ENGINE_URL,
  accessToken: string = env.ENGINE_TOKEN
): EngineService => {
  return new EngineService(url, accessToken);
};
