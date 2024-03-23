import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Request, Response } from "express";
import { nftCollectionAddress, chain } from "../data/address";
import { nfts } from "../data/nfts";
require('dotenv').config();
export const getNfts = async (req: Request, res: Response) => {

  if (req.method === "GET") {
    const sdk = ThirdwebSDK.fromPrivateKey(
      process.env.WALLET_PRIVATE_KEY!,
      chain,
      {
        secretKey: process.env.TW_SECRET_KEY,
      }
    );
    
    const nftCollection = await sdk.getContract(
      nftCollectionAddress,
      "nft-collection"
    );

    try {
      const mintedNfts = await nftCollection?.erc721.getAll();
      //for debug
      //return res.status(200).json(mintedNfts);

      if (!mintedNfts) {
        return res.status(200).json(nfts);
      }

      mintedNfts.forEach((nft) => {
        const nftIndex = nfts.findIndex(
          // @ts-ignore
          (nftItem) => nftItem.id === nft.metadata.attributes[0].id
        );
        //return res.status(200).json({"err":"err"});

        if (nftIndex !== -1) {
          nfts[nftIndex].minted = true;
        }
      });

      return res.status(200).json(nfts);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default getNfts;

