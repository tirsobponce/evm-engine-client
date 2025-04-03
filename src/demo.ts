import { createEngineService } from "./engine";

async function main() {
  const engineService = createEngineService();

  const walletLabel = "USER_ID";
  try {
    const newWallet = await engineService.createWallet(walletLabel);
    console.log("Wallet created: \n", newWallet);
  } catch (error) {
    console.error("Failed to create wallet:", error);
  }

  try {
    const wallets = await engineService.getAllWallets();
    console.log("All wallets: \n", wallets);
  } catch (error) {
    console.error("Failed to get wallets:", error);
  }
}

main().catch(console.error);
