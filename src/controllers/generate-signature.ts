import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { nftCollectionAddress } from "../data/address";
import { NFT } from "../models/NFT";
import { Request, Response } from "express";
import { nfts } from "../data/nfts";

//TODO check async need and meaning
export const generateSignature = async (req: Request, res: Response) => {
  //const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const jsonData = {
    to: "0x16d4D960b9aA4D2278992b9D4FC13A25FDabCd6e",
    royaltyRecipient: "0x16d4D960b9aA4D2278992b9D4FC13A25FDabCd6e",
    royaltyBps: 100,
    primarySaleRecipient: "0x16d4D960b9aA4D2278992b9D4FC13A25FDabCd6e",
    tokenId: 5,
    uri: "uri",
    quantity: 1,
    pricePerToken: 10000,
    currency: "0x5C676A4AE6828Df7C1Fb140D5b99B0e4f3aB2471",
    validityStartTimestamp: 1672320000,
    validityEndTimestamp: 1672406400,
    uid: "0x0000000000000000000000000000000000000000000000000000000000000005",
  };
  //const { tokenId: id, to: address } = jsonData;
  const { tokenId: id, to: address } = req.body;

  try {
    const sdk = ThirdwebSDK.fromPrivateKey(
      process.env.WALLET_PRIVATE_KEY!,
      "mumbai",
      {
        secretKey: process.env.TW_SECRET_KEY,
      }
    );

    const nftCollection = await sdk.getContract(
      nftCollectionAddress,
      "nft-collection"
    );

    const mintedNfts = await nftCollection?.erc721.getAll();

    if (mintedNfts) {
      const mintedNft = mintedNfts.find(
        // @ts-ignore
        (nft) => nft.metadata.id === id
      );

      if (mintedNft) {
        return res.status(400).json({ error: "NFT already minted" });
      }
    }

    const { name, description, url, price } = nfts[id];

    const metadata = {
      metadata: {
        name,
        description,
        image: url,
        attributes: [{ id }],
      },
      price,
      to: address,
    };

    const signature = await nftCollection?.signature.generate(metadata);
    console.log(metadata);
    console.log(signature);

    await nftCollection?.signature.mint(signature);


    return res.status(200).json({ signature });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

//TODO check if export like that is required
export default generateSignature;
