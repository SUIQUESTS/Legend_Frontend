import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { Transaction } from "@mysten/sui/transactions";


const { secretKey } = decodeSuiPrivateKey(import.meta.env.VITE_PRIVATE_KEY as string);
const keypair = Ed25519Keypair.fromSecretKey(secretKey);
const owner = keypair.getPublicKey().toSuiAddress();
console.log(`Owner Address: ${owner}`);


const provider = new SuiClient({ url: getFullnodeUrl('testnet') });
const packageId = "0xedf2c6c215b787828e9a05b0d07b9b2309fe573d23e0812ab1ceb489debc5742";
const collectionId = "0x86fddab76265fa12073028d97243851a2fbadfa98d0065014e1057804c33511b";


console.log(`Owner Address: ${owner}`);

export async function transferNFT(nftId: string, recipient: string) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::nft::transfer_nft`,
    arguments: [
      tx.object(nftId),
      tx.pure.address(recipient),
    ],
  });

  return await provider.signAndExecuteTransaction({
    transaction: tx,
    signer: keypair,
  });
}