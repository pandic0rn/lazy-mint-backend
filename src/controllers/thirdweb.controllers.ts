import { Request, Response } from 'express';
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { nftCollectionAddress } from "../data/address";
import { nfts } from "../data/nfts";
import {
  MediaRenderer,
  useAddress,
  useContract,
  Web3Button,
} from "@thirdweb-dev/react";
import generateSignature from './generate-signature copy';


export const getDoAnything = (req: Request, res: Response): void => {
    const json = '{"dummy": "dummy json"}'
    var dummy;
  
    const mintNft = async (id: number) => {
      alert("NFT successfully minted!");
      try {
        const response = generateSignature(req,res);
        dummy = response;
        
        if (response) {
          const data = await response;
          console.log(data);
          //await nftCollection?.signature.mint(data.signature);
          alert("NFT successfully minted!");
        }
      } catch (error) {
        alert("Failed to mint NFT!");
      } finally {
      }
    };

   res.status(200).json(dummy);
  };